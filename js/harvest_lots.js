import { load, save, uid, todayISO, logActivity, can, buildQrPayload } from "./store.js";

const KEY="mdt_harvest_lots_v1";
const BATCH_KEY="mdt_batches_v1";
const ISSUES_KEY="mdt_issues_v1";
const LINEAGE_KEY="mdt_lineage_v1";

let editId=null;

function esc(s){return String(s??"").replace(/[&<>"']/g,c=>({ "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;" }[c]));}

function batches(){ return load(BATCH_KEY, []); }
function lots(){ return load(KEY, []); }
function issues(){ return load(ISSUES_KEY, []); }
function lineage(){ return load(LINEAGE_KEY, []); }


function fillFlushes(){
  const sel=document.getElementById("lotFlushId");
  if(!sel) return;
  const batchId = document.getElementById("lotBatch")?.value || "";
  const list=lineage().filter(r=>String(r.type||"").toLowerCase()==="flush").filter(r=>!batchId || r.batch_id===batchId).slice().sort((a,b)=>(b.date||"").localeCompare(a.date||""));
  sel.innerHTML = `<option value="">—</option>` + list.map(r=>`<option value="${esc(r.id)}">${esc(r.id)} • ${(r.date||"")} • ${esc(r.notes||"")}</option>`).join("");
}
function fillBatches(){
  const list=batches().slice().sort((a,b)=>(a.name||"").localeCompare(b.name||""));
  document.getElementById("batchFilter").innerHTML = `<option value="">All batches</option>` + list.map(b=>`<option value="${esc(b.id)}">${esc(b.name)}</option>`).join("");
  document.getElementById("lotBatch").innerHTML = `<option value="">—</option>` + list.map(b=>`<option value="${esc(b.id)}">${esc(b.name)}</option>`).join("");
}

function render(){
  const bf=document.getElementById("batchFilter").value||"";
  const rf=document.getElementById("releaseFilter").value||"";
  const q=(document.getElementById("search").value||"").trim().toLowerCase();
  const list=lots().filter(l=>!bf||l.batch_id===bf).filter(l=>{
    if(!rf) return true;
    return rf==="released" ? !!l.released : !l.released;
  }).filter(l=>{
    if(!q) return true;
    return JSON.stringify(l).toLowerCase().includes(q);
  }).slice().sort((a,b)=>(b.date||"").localeCompare(a.date||""));

  const tbody=document.getElementById("lotsBody");
  tbody.innerHTML = list.map(l=>{
    const rel = l.released ? `<span class="badge bg-success">Released</span>` : `<span class="badge bg-warning text-dark">Hold</span>`;
    const actions = `
      <button class="btn btn-sm btn-outline-secondary me-2" data-action="label" data-id="${esc(l.id)}">Label</button>
      ${(can("edit","harvest_lots")||can("*","*")) ? `<button class="btn btn-sm btn-outline-primary me-2" data-action="edit" data-id="${esc(l.id)}">Edit</button>` : ""}
      ${(can("edit","harvest_lots")||can("*","*")) ? `<button class="btn btn-sm btn-outline-danger" data-action="delete" data-id="${esc(l.id)}">Delete</button>` : ""}
    `;
    return `
      <tr>
        <td class="text-muted small">${esc(l.date)}</td>
        <td><strong>${esc(l.id)}</strong></td>
        <td>${esc(l.batch_id)}</td>
        <td>${esc(l.flush_no)}</td>
        <td class="text-end">${esc(l.wet_kg??"")}</td>
        <td class="text-end">${esc(l.dry_kg??"")}</td>
        <td>${esc(l.grade||"")}</td>
        <td>${rel}</td>
        <td class="text-end">${actions}</td>
      </tr>`;
  }).join("");
}

function openModal(item=null){
  editId=item?.id ?? null;
  document.getElementById("lotDate").value = item?.date ?? todayISO();
  document.getElementById("lotBatch").value = item?.batch_id ?? "";
  document.getElementById("lotFlush").value = item?.flush_no ?? 1;
  document.getElementById("lotWet").value = item?.wet_kg ?? "";
  document.getElementById("lotDry").value = item?.dry_kg ?? "";
  document.getElementById("lotGrade").value = item?.grade ?? "A";
  document.getElementById("lotReleased").value = String(!!item?.released);
  document.getElementById("lotNotes").value = item?.notes ?? "";
  document.getElementById("lotWarn").classList.add("d-none");
  bootstrap.Modal.getOrCreateInstance(document.getElementById("lotModal")).show();
}

function validate(){
  const date=document.getElementById("lotDate").value||todayISO();
  const batch_id=document.getElementById("lotBatch").value||"";
  const flush_no=Number(document.getElementById("lotFlush").value||1);
  const flush_id=(document.getElementById("lotFlushId")?.value||"");
  const wet_kg=document.getElementById("lotWet").value==="" ? "" : Number(document.getElementById("lotWet").value);
  const dry_kg=document.getElementById("lotDry").value==="" ? "" : Number(document.getElementById("lotDry").value);
  const grade=document.getElementById("lotGrade").value||"";
  const released=document.getElementById("lotReleased").value==="true";
  const notes=(document.getElementById("lotNotes").value||"").trim();
  if(!batch_id){ alert("Batch required"); return null; }
  if(wet_kg==="" || Number.isNaN(wet_kg)){ alert("Wet kg required"); return null; }

  // QA gating: if there are open/high issues for batch, warn and force hold unless admin
  const openHigh = issues().some(i=>i.batch_id===batch_id && i.status!=="closed" && (i.severity==="high"||i.severity==="critical"));
  const warn=document.getElementById("lotWarn");
  if(released && openHigh && !can("*","*")){ // admin bypass via can(*,*)
    warn.textContent = "QA required before release: there are open high-severity issues for this batch.";
    warn.classList.remove("d-none");
    return { id: editId || uid("lot"), date, batch_id, flush_no, flush_id, wet_kg, dry_kg, grade, released:false, notes };
  }
  return { id: editId || uid("lot"), date, batch_id, flush_no, flush_id, wet_kg, dry_kg, grade, released, notes };
}

function showLabel(lot){
  const area=document.getElementById("labelArea");
  area.classList.remove("d-none");
  area.innerHTML = "";

  const b = batches().find(x=>x.id===lot.batch_id);
  const payloadObj = {
    type: "harvest_lot",
    id: lot.id,
    batch_id: lot.batch_id,
    strain: b?.strain_name || "",
    date: lot.date,
    flush: lot.flush_no,
    grade: lot.grade
  };
  const qrValue = buildQrPayload(payloadObj);

  const card=document.createElement("div");
  card.className="label-card";
  card.innerHTML = `
    <div class="d-flex justify-content-between align-items-start">
      <div>
        <div class="h5 mb-1">Harvest Lot</div>
        <div><strong>${esc(lot.id)}</strong></div>
        <div class="text-muted small">Batch: ${esc(lot.batch_id)}${b?.strain_name ? " — "+esc(b.strain_name):""}</div>
        <div class="text-muted small">Date: ${esc(lot.date)} • Flush: ${esc(lot.flush_no)} • Grade: ${esc(lot.grade||"")}</div>
      </div>
      <div id="qr"></div>
    </div>
    <hr>
    <div class="small">Wet: <strong>${esc(lot.wet_kg)} kg</strong> ${lot.dry_kg!=="" ? `• Dry: <strong>${esc(lot.dry_kg)} kg</strong>` : ""}</div>
    <div class="small">Release: ${lot.released ? "<span class='badge bg-success'>Released</span>" : "<span class='badge bg-warning text-dark'>Hold</span>"}</div>
    <div class="small text-muted mt-2">${esc(lot.notes||"")}</div>
    <div class="mt-3 no-print d-flex gap-2">
      <button class="btn btn-outline-secondary btn-sm" id="hideLabelBtn">Close</button>
      <button class="btn btn-primary btn-sm" onclick="window.print()">Print</button>
    </div>
  `;
  area.appendChild(card);

  const qrEl=card.querySelector("#qr");
  // QRCode library from CDN provides QRCode.toCanvas / toDataURL
  try{
    const canvas=document.createElement("canvas");
    qrEl.appendChild(canvas);
    window.QRCode.toCanvas(canvas, qrValue, { width: 128, margin: 1 });
  }catch(e){
    qrEl.textContent="(QR unavailable)";
  }

  card.querySelector("#hideLabelBtn").addEventListener("click", ()=>{
    area.classList.add("d-none");
    area.innerHTML="";
  });
}

document.getElementById("newLotBtn").addEventListener("click", ()=>{
  if(!can("create","harvest_lots") && !can("*","*")){ alert("Not permitted."); return; }
  openModal(null);
});

document.getElementById("saveLotBtn").addEventListener("click", ()=>{
  if(!can("create","harvest_lots") && !can("edit","harvest_lots") && !can("*","*")){ alert("Not permitted."); return; }
  const built=validate(); if(!built) return;
  // AUTO_CREATE_FLUSH: if lot not linked to a flush lineage record, create one (optional)
  if(!built.flush_id){
    try{
      const lin = load(LINEAGE_KEY, []);
      const rec = { id: uid("flush"), type:"flush", date: built.date, strain_id:"", parent_id:"", batch_id: built.batch_id, notes: `Auto flush #${built.flush_no} from harvest lot ${built.id}` };
      lin.unshift(rec);
      save(LINEAGE_KEY, lin);
      built.flush_id = rec.id;
      try{ fillFlushes(); }catch(e){}
    }catch(e){}
  }
  const list=lots();
  const now=new Date().toISOString();
  built.updated_at=now;
  built.created_at=list.find(x=>x.id===built.id)?.created_at ?? now;
  const idx=list.findIndex(x=>x.id===built.id);
  if(idx>=0) list[idx]=built; else list.unshift(built);
  save(KEY, list);
  logActivity({ action: idx>=0?"update":"create", entity:"harvest_lots", entity_id: built.id, summary: `Harvest lot ${built.id} (${built.wet_kg} kg)`, data: built });
  bootstrap.Modal.getInstance(document.getElementById("lotModal"))?.hide();
  render();
});

document.getElementById("lotsBody").addEventListener("click",(e)=>{
  const btn=e.target.closest("button[data-action]"); if(!btn) return;
  const id=btn.dataset.id;
  const list=lots();
  const item=list.find(x=>x.id===id); if(!item) return;
  if(btn.dataset.action==="label") showLabel(item);
  if(btn.dataset.action==="edit") openModal(item);
  if(btn.dataset.action==="delete"){
    if(!confirm("Delete this harvest lot?")) return;
    save(KEY, list.filter(x=>x.id!==id));
    logActivity({ action:"delete", entity:"harvest_lots", entity_id:id, summary:"Deleted harvest lot", data:item });
    render();
  }
});

document.getElementById("batchFilter").addEventListener("change", render);
document.getElementById("releaseFilter").addEventListener("change", render);
document.getElementById("search").addEventListener("input", render);

fillBatches();
  fillFlushes();
  render();


document.getElementById("lotBatch")?.addEventListener("change", ()=>{ try{ fillFlushes(); }catch(e){} });
