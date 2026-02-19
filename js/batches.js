import { load, save, uid, todayISO, logActivity, can } from "./store.js";

const KEY="mdt_batches_v1";
const STRAINS_KEY="mdt_strains_v1";
const ISSUES_KEY="mdt_issues_v1";
const LOTS_KEY="mdt_harvest_lots_v1";
const LINEAGE_KEY="mdt_lineage_v1";
const TX_KEY="mdt_supply_transactions_v1";
const SUP_KEY="mdt_supplies_v1";
const STAGE_KEYS={
  preparation:"mdt_stage_preparation_v1",
  inoculation:"mdt_stage_inoculation_v1",
  incubation:"mdt_stage_incubation_v1",
  fruiting:"mdt_stage_fruiting_v1",
  harvest:"mdt_stage_harvest_v1",
  cleaning:"mdt_stage_cleaning_v1",
  qa:"mdt_stage_qa_v1"
};


let editId=null;
let currentDetailBatchId=null;

// Prefill search from URL (?q=) when present
const __sp = new URLSearchParams(window.location.search);
const __q = __sp.get("q");

function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}

function loadStrains(){
  return load(STRAINS_KEY, []);
}

function fillStrains(){
  const sel=document.getElementById("batchStrain");
  sel.innerHTML = `<option value="">—</option>` + loadStrains().map(s=>`<option value="${esc(s.id)}">${esc(s.name)}</option>`).join("");
}

function matches(item, q){
  if(!q) return true;
  q=q.toLowerCase();
  return (item.name||"").toLowerCase().includes(q) || (item.strain_name||"").toLowerCase().includes(q);
}

function render(){
  const q=(document.getElementById("search").value||"").trim();
  const status=(document.getElementById("statusFilter").value||"").trim();
  const tbody=document.getElementById("batchesBody");
  const items=load(KEY, []).filter(x=>matches(x,q)).filter(x=>!status || x.status===status);
  tbody.innerHTML="";
  for(const b of items){
    const tr=document.createElement("tr");
    tr.innerHTML=`
      <td><strong>${esc(b.name||"")}</strong><div class="text-muted small">${esc(b.id)}</div></td>
      <td>${esc(b.strain_name||"")}</td>
      <td>${esc(b.start_date||"")}</td>
      <td><span class="badge bg-secondary">${esc(b.status||"")}</span></td>
      <td>${esc(b.notes||"")}</td>
      <td class="text-end">
        <button class="btn btn-sm btn-outline-primary me-2" data-action="view" data-id="${esc(b.id)}">Edit</button>
        <button class="btn btn-sm btn-outline-danger" data-action="delete" data-id="${esc(b.id)}">Delete</button>
      </td>`;
    tbody.appendChild(tr);
  }
}


function stageSummaryForBatch(batchId){
  const out = [];
  for(const [slug,key] of Object.entries(STAGE_KEYS)){
    const logs = load(key, []).filter(l=>l.batch_id===batchId);
    if(!logs.length) continue;
    const latest = logs.slice().sort((a,b)=>(b.date||"").localeCompare(a.date||""))[0];
    out.push({ slug, count: logs.length, latest: latest.date || "" });
  }
  const order = ["preparation","inoculation","incubation","fruiting","harvest","cleaning","qa"];
  out.sort((a,b)=>order.indexOf(a.slug)-order.indexOf(b.slug));
  return out;
}

function renderBatchDetail(batch){
const lineage = load("mdt_lineage_v1", []);
function lineageChain(id){
  const chain=[];
  let cur = lineage.find(x=>x.id===id);
  const seen=new Set();
  while(cur && !seen.has(cur.id)){
    seen.add(cur.id);
    chain.push(cur);
    cur = cur.parent_id ? lineage.find(x=>x.id===cur.parent_id) : null;
  }
  return chain;
}
const chain = batch.lineage_id ? lineageChain(batch.lineage_id) : [];

  const stages = stageSummaryForBatch(batch.id);
  const issues = load(ISSUES_KEY, []).filter(i=>i.batch_id===batch.id).slice().sort((a,b)=>(b.date||"").localeCompare(a.date||""));
  const lots = load(LOTS_KEY, []).filter(l=>l.batch_id===batch.id).slice().sort((a,b)=>(b.date||"").localeCompare(a.date||""));
  const txs = load(TX_KEY, []).filter(t=>t.batch_id===batch.id);
  const supplies = load(SUP_KEY, []);

  const consumed = {};
  for(const t of txs){
    if(t.type!=="use") continue;
    consumed[t.supply_item_id] = (consumed[t.supply_item_id]||0) + Number(t.qty||0);
  }
  const consumedRows = Object.entries(consumed).slice().sort((a,b)=>b[1]-a[1]).map(([sid, qty])=>{
    const s = supplies.find(x=>x.supply_item_id===Number(sid));
    return `<tr><td>${esc(s?.name||sid)}</td><td class="text-end">${qty.toFixed(3)} ${esc(s?.unit_code||"")}</td></tr>`;
  }).join("");

  return `
    <div class="mb-2">
      <div class="h5 mb-0">${esc(batch.name||"")}</div>
      <div class="text-muted small">${esc(batch.id)} · ${esc(batch.strain_name||"")} · ${esc(batch.status||"")}</div>
    </div>

    <div class="mb-3">
      <div class="card shadow-sm">
        <div class="card-body">
          <h6 class="card-title mb-2">Lineage</h6>
          ${chain.length ? `<div class="small">${chain.map((x,idx)=>`${idx===0?`<span class="badge bg-primary me-1">${esc(x.type)}</span>`:`<span class="badge bg-secondary me-1">${esc(x.type)}</span>`} <span class="text-monospace">${esc(x.id)}</span> <span class="text-muted">${esc(x.date||"")}</span>`).join("<br>")}</div>` : `<div class="text-muted small">No lineage linked. Link a source lot in Edit.</div>`}
        </div>
      </div>
    </div>

    <div class="row g-3">
      <div class="col-lg-6">
        <div class="card shadow-sm">
          <div class="card-body">
            <h6 class="card-title mb-2">Timeline</h6>
            <ol class="mb-0">
              ${stages.length ? stages.map(s=>`<li><strong>${esc(s.slug)}</strong> — ${esc(s.count)} log(s), latest ${esc(s.latest)}</li>`).join("") : `<li class="text-muted">No stage logs yet.</li>`}
            </ol>
            <div class="mt-3 d-flex gap-2 flex-wrap">
              <a class="btn btn-sm btn-outline-secondary" href="preparation.html?batch=${encodeURIComponent(batch.id)}">Open Prep</a>
              <a class="btn btn-sm btn-outline-secondary" href="inoculation.html?batch=${encodeURIComponent(batch.id)}">Open Inoc</a>
              <a class="btn btn-sm btn-outline-secondary" href="incubation.html?batch=${encodeURIComponent(batch.id)}">Open Inc</a>
              <a class="btn btn-sm btn-outline-secondary" href="fruiting.html?batch=${encodeURIComponent(batch.id)}">Open Fruit</a>
              <a class="btn btn-sm btn-outline-secondary" href="harvest.html?batch=${encodeURIComponent(batch.id)}">Open Harvest</a>
              <a class="btn btn-sm btn-outline-secondary" href="qa.html?batch=${encodeURIComponent(batch.id)}">Open QA</a>
            </div>
          </div>
        </div>

        <div class="card shadow-sm mt-3">
          <div class="card-body">
            <h6 class="card-title mb-2">Issues</h6>
            ${issues.length ? `<ul class="mb-0">${issues.slice(0,8).map(i=>`<li>${esc(i.date)} — ${esc(i.type)} (${esc(i.severity)}) · ${esc(i.status)}</li>`).join("")}</ul>` : `<div class="text-muted">No issues logged.</div>`}
            <div class="mt-2"><a href="issues.html?q=${encodeURIComponent(batch.id)}">View all issues</a></div>
          </div>
        </div>
      </div>

      <div class="col-lg-6">
        <div class="card shadow-sm">
          <div class="card-body">
            <h6 class="card-title mb-2">Harvest lots</h6>
            ${lots.length ? `<ul class="mb-0">${lots.slice(0,8).map(l=>`<li>${esc(l.date)} — ${esc(l.id)} · flush ${esc(l.flush_no)} · wet ${esc(l.wet_kg)} kg · ${l.released? "Released":"Hold"}</li>`).join("")}</ul>` : `<div class="text-muted">No harvest lots yet.</div>`}
            <div class="mt-2"><a href="harvest_lots.html?q=${encodeURIComponent(batch.id)}">Manage harvest lots</a></div>
          </div>
        </div>

        <div class="card shadow-sm mt-3">
          <div class="card-body">
            <h6 class="card-title mb-2">Supplies consumed</h6>
            <div class="table-responsive">
              <table class="table table-sm mb-0">
                <thead><tr><th>Supply</th><th class="text-end">Qty</th></tr></thead>
                <tbody>${consumedRows || `<tr><td colspan="2" class="text-muted">No consumption recorded yet.</td></tr>`}</tbody>
              </table>
            </div>
            <div class="mt-2 text-muted small">Record consumption from stage logs using the “Consume” button.</div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function openDetailModal(batch){
  currentDetailBatchId = batch?.id || null;
  const el=document.getElementById("batchDetailContent");
  el.innerHTML = renderBatchDetail(batch);
  bootstrap.Modal.getOrCreateInstance(document.getElementById("batchDetailModal")).show();
}


function openModal(batch=null){
  editId=batch?.id ?? null;
  document.getElementById("batchName").value=batch?.name ?? "";
  document.getElementById("batchStrain").value=batch?.strain_id ?? "";
  const linSel=document.getElementById("batchLineage");
  if(linSel) linSel.value = batch?.lineage_id ?? "";
  document.getElementById("batchStart").value=batch?.start_date ?? todayISO();
  document.getElementById("batchStatus").value=batch?.status ?? "Planned";
  document.getElementById("batchNotes").value=batch?.notes ?? "";
  bootstrap.Modal.getOrCreateInstance(document.getElementById("batchModal")).show();
}

function closeModal(){
  const m=bootstrap.Modal.getInstance(document.getElementById("batchModal"));
  if(m) m.hide();
}

document.getElementById("saveBatchBtn").addEventListener("click", ()=>{
  const name=document.getElementById("batchName").value.trim();
  if(!name){alert("Batch name is required."); return;}
  const strain_id=document.getElementById("batchStrain").value || "";
  const lineage_id=(document.getElementById("batchLineage")?.value)||"";
  const strain=loadStrains().find(s=>String(s.id)===String(strain_id));
  const start_date=document.getElementById("batchStart").value || todayISO();
  const status=document.getElementById("batchStatus").value;
  const notes=document.getElementById("batchNotes").value.trim();

  const items=load(KEY, []);
  const now=new Date().toISOString();
  const obj={
    id: editId || uid("batch"),
    name,
    strain_id,
    strain_name: strain ? strain.name : "",
    start_date,
    status,
    notes,
    lineage_id,
    updated_at: now,
    created_at: items.find(x=>x.id===editId)?.created_at ?? now
  };
  const idx=items.findIndex(x=>x.id===obj.id);
  if(idx>=0) items[idx]=obj; else items.unshift(obj);
  save(KEY, items);
  logActivity({ action: idx>=0?"update":"create", entity:"batches", entity_id: obj.id, summary: `${obj.name} · ${obj.status}`, data: obj });
  closeModal();
  render();
});

document.getElementById("batchesBody").addEventListener("click", (e)=>{
  const btn=e.target.closest("button[data-action]");
  if(!btn) return;
  const id=btn.dataset.id;
  const items=load(KEY, []);
  const batch=items.find(x=>x.id===id);
  if(!batch) return;
  if(btn.dataset.action==="edit") openModal(batch);
  if(btn.dataset.action==="delete"){
    if(!confirm(`Delete batch "${batch.name}"? This will not delete stage logs.`)) return;
    save(KEY, items.filter(x=>x.id!==id));
    logActivity({ action:"delete", entity:"batches", entity_id:id, summary:"Deleted batch", data:item });
    render();
  }
});

const __searchEl = document.getElementById("search");
if(__q && __searchEl){ __searchEl.value = __q; }

__searchEl?.addEventListener("input", render);
document.getElementById("statusFilter").addEventListener("change", render);
document.querySelector('button[data-bs-target="#batchModal"]')?.addEventListener("click", ()=>openModal(null));

fillStrains();
  try{ fillLineage(); }catch{}
render();


function lineage(){ return load(LINEAGE_KEY, []); }
function supplies(){ return load(SUP_KEY, []); }
function transactions(){ return load(TX_KEY, []); }

function stageLogsForBatch(batchId){
  const out = {};
  for(const [slug,key] of Object.entries(STAGE_KEYS)){
    const logs = load(key, []).filter(l=>l.batch_id===batchId).slice().sort((a,b)=>(a.date||"").localeCompare(b.date||""));
    out[slug]=logs;
  }
  return out;
}

function lineageChainForBatch(batch){
  const list = lineage();
  const startId = batch?.source_lineage_id || "";
  if(!startId) return [];
  const map = new Map(list.map(r=>[r.id,r]));
  const chain = [];
  const seen = new Set();
  let cur = map.get(startId);
  while(cur && !seen.has(cur.id) && chain.length < 50){
    seen.add(cur.id);
    chain.push(cur);
    cur = cur.parent_id ? map.get(cur.parent_id) : null;
  }
  return chain;
}

function buildTraceReport(batchId){
  const batch = load(KEY, []).find(b=>b.id===batchId);
  if(!batch) return null;

  const issuesList = load(ISSUES_KEY, []).filter(i=>i.batch_id===batchId).slice().sort((a,b)=>(b.date||"").localeCompare(a.date||""));
  const lotsList = load(LOTS_KEY, []).filter(l=>l.batch_id===batchId).slice().sort((a,b)=>(b.date||"").localeCompare(a.date||""));

  const logsByStage = stageLogsForBatch(batchId);

  // Transactions linked to this batch (direct or via stage logs)
  const tx = transactions().filter(t=>t.batch_id===batchId).slice().sort((a,b)=>(b.date||"").localeCompare(a.date||""));
  const supMap = new Map(supplies().map(s=>[String(s.supply_item_id), s]));

  const txEnriched = tx.map(t=>({
    ...t,
    supply_name: supMap.get(String(t.supply_item_id||""))?.name || ""
  }));

  const chain = lineageChainForBatch(batch);

  // Summary metrics
  const totalWet = lotsList.reduce((acc,l)=>acc + (Number(l.wet_kg)||0), 0);
  const openSev = issuesList.filter(i=>String(i.status||"").toLowerCase()!=="closed").reduce((m,i)=>{
    const s=String(i.severity||"").toLowerCase();
    m[s]=(m[s]||0)+1; return m;
  },{});

  return {
    meta: { generated_at: new Date().toISOString(), app: "MD Tracer", schema: "trace_report_v1" },
    batch,
    lineage_chain: chain,
    issues: issuesList,
    harvest_lots: lotsList,
    stage_logs: logsByStage,
    supply_transactions: txEnriched,
    summary: {
      total_wet_kg: Number(totalWet.toFixed(3)),
      open_issues_by_severity: openSev
    }
  };
}

function downloadText(filename, text, mime="application/json"){
  const blob = new Blob([text], { type: mime });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(()=>{ URL.revokeObjectURL(a.href); a.remove(); }, 250);
}

function printTraceReport(report){
  const w = window.open("", "_blank");
  if(!w) return alert("Popup blocked. Please allow popups for printing.");
  const escHtml = (s)=>String(s??"").replace(/[&<>"']/g,c=>({ "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;" }[c]));
  const batch=report.batch;
  const chain=report.lineage_chain||[];
  const lots=report.harvest_lots||[];
  const issues=report.issues||[];
  const tx=report.supply_transactions||[];
  const stages=Object.entries(report.stage_logs||{}).map(([k,v])=>({k,v}));

  const html = `
  <!doctype html>
  <html><head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Trace Report ${escHtml(batch.id)}</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
      body{ padding:24px; }
      .muted{ color: rgba(0,0,0,.6); }
      @media print{ .no-print{ display:none !important; } }
      code{ font-size: .9em; }
    </style>
  </head><body>
    <div class="d-flex justify-content-between align-items-start no-print mb-3">
      <div>
        <h2 class="mb-0">Trace Report</h2>
        <div class="muted">Generated ${escHtml(report.meta.generated_at)}</div>
      </div>
      <button class="btn btn-primary" onclick="window.print()">Print / Save PDF</button>
    </div>

    <div class="card mb-3"><div class="card-body">
      <h5 class="card-title mb-1">Batch</h5>
      <div><strong>${escHtml(batch.name||batch.id)}</strong> <span class="muted">(${escHtml(batch.id)})</span></div>
      <div class="muted">Strain: ${escHtml(batch.strain_name||"")} • Status: ${escHtml(batch.status||"")} • Start: ${escHtml(batch.start_date||"")}</div>
      ${batch.source_lineage_id ? `<div class="muted">Source lineage: <code>${escHtml(batch.source_lineage_id)}</code></div>` : ``}
    </div></div>

    <div class="row g-3">
      <div class="col-lg-6">
        <div class="card mb-3"><div class="card-body">
          <h6 class="card-title">Lineage chain</h6>
          ${chain.length ? `<ol class="mb-0">${chain.map(r=>`<li><strong>${escHtml(r.type)}</strong> • <code>${escHtml(r.id)}</code> <span class="muted">${escHtml(r.date||"")}</span></li>`).join("")}</ol>` : `<div class="muted">No lineage linked.</div>`}
        </div></div>

        <div class="card mb-3"><div class="card-body">
          <h6 class="card-title">Harvest lots</h6>
          ${lots.length ? `<ul class="mb-0">${lots.map(l=>`<li>${escHtml(l.date)} • <code>${escHtml(l.id)}</code> • flush ${escHtml(l.flush_no)} • wet ${escHtml(l.wet_kg)} kg • ${l.released?"Released":"Hold"}</li>`).join("")}</ul>` : `<div class="muted">None.</div>`}
          <div class="mt-2 muted">Total wet: <strong>${escHtml(report.summary.total_wet_kg)}</strong> kg</div>
        </div></div>
      </div>

      <div class="col-lg-6">
        <div class="card mb-3"><div class="card-body">
          <h6 class="card-title">Issues</h6>
          ${issues.length ? `<ul class="mb-0">${issues.map(i=>`<li>${escHtml(i.date)} • ${escHtml(i.type)} • <strong>${escHtml(i.severity)}</strong> • ${escHtml(i.status)}</li>`).join("")}</ul>` : `<div class="muted">None.</div>`}
        </div></div>

        <div class="card mb-3"><div class="card-body">
          <h6 class="card-title">Supply transactions (linked)</h6>
          ${tx.length ? `<ul class="mb-0">${tx.slice(0,20).map(t=>`<li>${escHtml(t.date)} • ${escHtml(t.type)} • ${escHtml(t.supply_name||t.supply_item_id)} • ${escHtml(t.qty)} ${escHtml(t.unit_code||"")} ${t.stage?`<span class="muted">(${escHtml(t.stage)})</span>`:""}</li>`).join("")}</ul>` : `<div class="muted">None.</div>`}
          ${tx.length>20?`<div class="muted mt-2">Showing first 20 transactions…</div>`:""}
        </div></div>
      </div>
    </div>

    <div class="card"><div class="card-body">
      <h6 class="card-title">Stage logs</h6>
      ${stages.map(({k,v})=>`
        <div class="mb-2">
          <div><strong>${escHtml(k)}</strong> <span class="muted">(${v.length} log(s))</span></div>
          ${v.length ? `<ul class="mb-0">${v.slice(0,8).map(l=>`<li>${escHtml(l.date)} • ${escHtml(l.notes||l.summary||"")}</li>`).join("")}</ul>` : `<div class="muted">None</div>`}
          ${v.length>8?`<div class="muted">Showing first 8…</div>`:""}
        </div>
      `).join("")}
    </div></div>

  </body></html>`;
  w.document.open();
  w.document.write(html);
  w.document.close();
}

async function downloadTracePdf(report){
  // Uses jsPDF via ESM CDN; if blocked, user can Print instead.
  const batch = report.batch;
  const { jsPDF } = await import("https://cdn.jsdelivr.net/npm/jspdf@2.5.1/+esm");
  const doc = new jsPDF({ unit:"pt", format:"a4" });
  const margin = 40;
  let y = margin;

  function line(text, size=11, gap=16){
    doc.setFontSize(size);
    const split = doc.splitTextToSize(String(text), 515);
    for(const part of split){
      if(y > 770){ doc.addPage(); y = margin; }
      doc.text(part, margin, y);
      y += gap;
    }
  }

  line(`MD Tracer — Trace Report`, 16, 22);
  line(`Generated: ${report.meta.generated_at}`, 10, 16);
  y += 6;
  line(`Batch: ${batch.name||""} (${batch.id})`, 12, 18);
  line(`Strain: ${batch.strain_name||""}   Status: ${batch.status||""}   Start: ${batch.start_date||""}`, 11, 16);
  if(batch.source_lineage_id) line(`Source lineage: ${batch.source_lineage_id}`, 11, 16);

  y += 10;
  line(`Lineage chain:`, 12, 18);
  if(report.lineage_chain?.length){
    report.lineage_chain.forEach(r=> line(`- ${r.type} • ${r.id} • ${r.date||""}`, 10, 14));
  } else line(`(none)`, 10, 14);

  y += 8;
  line(`Harvest lots (total wet ${report.summary.total_wet_kg} kg):`, 12, 18);
  if(report.harvest_lots?.length){
    report.harvest_lots.forEach(l=> line(`- ${l.date} • ${l.id} • flush ${l.flush_no} • wet ${l.wet_kg} kg • ${l.released?"Released":"Hold"}`, 10, 14));
  } else line(`(none)`, 10, 14);

  y += 8;
  line(`Issues:`, 12, 18);
  if(report.issues?.length){
    report.issues.forEach(i=> line(`- ${i.date} • ${i.type} • ${i.severity} • ${i.status}`, 10, 14));
  } else line(`(none)`, 10, 14);

  y += 8;
  line(`Supply transactions (linked):`, 12, 18);
  if(report.supply_transactions?.length){
    report.supply_transactions.slice(0,40).forEach(t=> line(`- ${t.date} • ${t.type} • ${t.supply_name||t.supply_item_id} • ${t.qty} ${t.unit_code||""} ${t.stage?`(${t.stage})`:""}`, 10, 14));
    if(report.supply_transactions.length>40) line(`(truncated; see JSON export for full list)`, 10, 14);
  } else line(`(none)`, 10, 14);

  doc.save(`trace_${batch.id}_${new Date().toISOString().slice(0,10)}.pdf`);
}

function hookTraceButtons(){
  const btnJson = document.getElementById("btnTraceJson");
  const btnPrint = document.getElementById("btnTracePrint");
  const btnPdf = document.getElementById("btnTracePdf");
  if(btnJson){
    btnJson.addEventListener("click", ()=>{
      if(!currentDetailBatchId) return;
      const report = buildTraceReport(currentDetailBatchId);
      if(!report) return;
      downloadText(`trace_${report.batch.id}_${new Date().toISOString().slice(0,10)}.json`, JSON.stringify(report, null, 2));
    });
  }
  if(btnPrint){
    btnPrint.addEventListener("click", ()=>{
      if(!currentDetailBatchId) return;
      const report = buildTraceReport(currentDetailBatchId);
      if(!report) return;
      printTraceReport(report);
    });
  }
  if(btnPdf){
    btnPdf.addEventListener("click", async ()=>{
      if(!currentDetailBatchId) return;
      const report = buildTraceReport(currentDetailBatchId);
      if(!report) return;
      try{
        await downloadTracePdf(report);
      }catch(e){
        console.error(e);
        alert("Could not generate PDF in this browser. Use Print Trace Report instead.");
      }
    });
  }
}
hookTraceButtons();
