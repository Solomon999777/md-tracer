
import { load, save, uid, todayISO, can, logActivity, buildQrPayload } from "./store.js";

const KEY="mdt_lineage_v1";
const STRAIN_KEY="mdt_strains_v1";
const BATCH_KEY="mdt_batches_v1";
let editId=null;

const ALLOWED_PARENTS = {
  culture: [],
  "agar plate": ["culture"],
  agar: ["culture"],
  lc: ["culture","agar","agar plate"],
  "grain spawn": ["lc","agar","agar plate","culture"],
  grain: ["lc","agar","agar plate","culture"],
  "bulk substrate": ["grain spawn","grain"],
  bulk: ["grain spawn","grain"],
  "block/bag": ["bulk substrate","bulk"],
  block: ["bulk substrate","bulk"],
  flush: ["block/bag","block","bulk substrate","bulk"] // allow bulk->flush for direct fruiting
};

function normType(t){ return String(t||"").trim().toLowerCase(); }
function allowedParentTypes(childType){
  const ct=normType(childType);
  return new Set(ALLOWED_PARENTS[ct] || ALLOWED_PARENTS[childType] || []);
}


function esc(s){return String(s??"").replace(/[&<>"']/g,c=>({ "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;" }[c]));}
function lineage(){ return load(KEY, []); }
function strains(){ return load(STRAIN_KEY, []); }
function batches(){ return load(BATCH_KEY, []); }

function fillStrains(){
  const opts = strains().slice().sort((a,b)=>(a.name||"").localeCompare(b.name||"")).map(s=>`<option value="${esc(s.id)}">${esc(s.name)}</option>`).join("");
  document.getElementById("linStrain").innerHTML = `<option value="">—</option>` + opts;
  document.getElementById("strainFilter").innerHTML = `<option value="">All strains</option>` + opts;
}

function fillParents(){
  const list=lineage().slice().sort((a,b)=>(b.date||"").localeCompare(a.date||""));
  const opts = list.map(r=>`<option value="${esc(r.id)}">${esc(r.type)} • ${esc(r.id)} • ${(r.date||"")}</option>`).join("");
  document.getElementById("linParent").innerHTML = `<option value="">—</option>` + opts;
}

function fillBatches(){
  const list=batches().slice().sort((a,b)=>(a.name||"").localeCompare(b.name||""));
  const opts = list.map(b=>`<option value="${esc(b.id)}">${esc(b.name)}</option>`).join("");
  document.getElementById("linBatch").innerHTML = `<option value="">—</option>` + opts;
}

function render(){
  const q=(document.getElementById("search").value||"").trim().toLowerCase();
  const tf=document.getElementById("typeFilter").value||"";
  const sf=document.getElementById("strainFilter").value||"";
  const list=lineage()
    .filter(r=>!tf||r.type===tf)
    .filter(r=>!sf||r.strain_id===sf)
    .filter(r=>{
      if(!q) return true;
      return JSON.stringify(r).toLowerCase().includes(q);
    })
    .slice().sort((a,b)=>(b.date||"").localeCompare(a.date||""));

  const strainMap=new Map(strains().map(s=>[s.id,s.name]));
  const tbody=document.getElementById("lineageBody");
  tbody.innerHTML = list.map(r=>{
    const actions = (can("edit","lineage")||can("*","*")) ? `
      <button class="btn btn-sm btn-outline-secondary me-2" data-action="label" data-id="${esc(r.id)}">Label</button>
      <button class="btn btn-sm btn-outline-primary me-2" data-action="edit" data-id="${esc(r.id)}">Edit</button>
      <button class="btn btn-sm btn-outline-danger" data-action="delete" data-id="${esc(r.id)}">Delete</button>` : "";
    return `<tr>
      <td>${esc(r.date||"")}</td>
      <td><span class="badge bg-secondary">${esc(r.type||"")}</span></td>
      <td class="text-monospace">${esc(r.id)}</td>
      <td>${esc(strainMap.get(r.strain_id)||"")}</td>
      <td class="text-monospace">${esc(r.parent_id||"")}</td>
      <td class="text-muted small">${esc(r.notes||"")}</td>
      <td class="text-end">${actions}</td>
    </tr>`;
  }).join("");

  document.getElementById("emptyState").classList.toggle("d-none", list.length>0);

  tbody.querySelectorAll("button[data-action]").forEach(btn=>{
    const id=btn.getAttribute("data-id");
    const action=btn.getAttribute("data-action");
    btn.addEventListener("click", ()=>{
      if(action==="label") { const rec=lineage().find(x=>x.id===id); if(rec) showLabel(rec); }
      if(action==="edit") openEdit(id);
      if(action==="delete") doDelete(id);
    });
  });
}

function openNew(){
  editId=null;
  document.getElementById("linDate").value=todayISO();
  document.getElementById("linType").value="culture";
  document.getElementById("linStrain").value="";
  document.getElementById("linParent").value="";
  document.getElementById("linBatch").value="";
  document.getElementById("linNotes").value="";
  document.getElementById("linWarn").classList.add("d-none");
  new bootstrap.Modal(document.getElementById("lineageModal")).show();
}

function openEdit(id){
  const it=lineage().find(x=>x.id===id);
  if(!it) return;
  editId=id;
  document.getElementById("linDate").value=it.date||todayISO();
  document.getElementById("linType").value=it.type||"culture";
  document.getElementById("linStrain").value=it.strain_id||"";
  document.getElementById("linParent").value=it.parent_id||"";
  document.getElementById("linBatch").value=it.batch_id||"";
  document.getElementById("linNotes").value=it.notes||"";
  document.getElementById("linWarn").classList.add("d-none");
  new bootstrap.Modal(document.getElementById("lineageModal")).show();
}

function validateAndBuild(){
  const date=document.getElementById("linDate").value||todayISO();
  const type=document.getElementById("linType").value;
  const strain_id=document.getElementById("linStrain").value||"";
  const parent_id=document.getElementById("linParent").value||"";
  const batch_id=document.getElementById("linBatch").value||"";
  const notes=(document.getElementById("linNotes").value||"").trim();
  if(!type){ alert("Type required"); return null; }
  if(!strain_id){ alert("Strain required"); return null; }
  if(parent_id && parent_id === (editId||"")){ alert("Parent cannot be self"); return null; }

  // Enforce parent-type rules
  const allowed = allowedParentTypes(type);
  if(parent_id && allowed.size>0){
    const p = lineage().find(x=>x.id===parent_id);
    if(p && !allowed.has(normType(p.type))){
      alert(`Invalid parent type for ${type}. Choose a compatible parent.`);
      return null;
    }
  }

  // Prevent cycles (ancestor cannot be self)
  if(parent_id){
    const seen=new Set([editId||""]);
    let cur = lineage().find(x=>x.id===parent_id);
    while(cur){
      if(cur.id === (editId||"")){
        alert("Invalid parent: would create a cycle.");
        return null;
      }
      if(seen.has(cur.id)) break;
      seen.add(cur.id);
      cur = cur.parent_id ? lineage().find(x=>x.id===cur.parent_id) : null;
    }
  }

  return { id: editId || uid("lin"), date, type, strain_id, parent_id, batch_id, notes };
}

function saveItem(){
  if(!can("create","lineage") && !can("edit","lineage") && !can("*","*")){ alert("Not permitted."); return; }
  const built=validateAndBuild(); if(!built) return;
  const list=lineage();
  const idx=list.findIndex(x=>x.id===built.id);
  if(idx>=0) list[idx]=built; else list.unshift(built);
  save(KEY, list);

  // If linked to batch, store reference on batch for easier tracing
  if(built.batch_id){
    const bs=batches();
    const b=bs.find(x=>x.id===built.batch_id);
    if(b && !b.lineage_id) { b.lineage_id = built.id; save(BATCH_KEY, bs); }
  }

  try { logActivity({ action: idx>=0?"update":"create", entity:"lineage", entity_id: built.id, summary: `${built.type} ${built.id}`}); } catch {}
  bootstrap.Modal.getInstance(document.getElementById("lineageModal")).hide();
  fillParents();
  render();
}

function doDelete(id){
  const rec=lineage().find(x=>x.id===id);
  if(!rec) return;

  // Block delete if there are children
  const children = lineage().filter(x=>x.parent_id===id);
  if(children.length){
    alert(`Cannot delete: ${children.length} child record(s) depend on this item.`);
    return;
  }

  // Block delete if linked from batches
  const bs=batches().filter(b=>b.lineage_id===id);
  if(bs.length){
    alert(`Cannot delete: linked to ${bs.length} batch(es). Unlink it from batches first.`);
    return;
  }

  // Block delete if linked from harvest lots (flush linkage)
  const lots = load("mdt_harvest_lots_v1", []).filter(l=>l.flush_id===id);
  if(lots.length){
    alert(`Cannot delete: linked to ${lots.length} harvest lot(s). Unlink flush from harvest lots first.`);
    return;
  }

  if(!confirm("Delete this record?")) return;
  const list=lineage().filter(x=>x.id!==id);
  save(KEY, list);
  try { logActivity({ action:"delete", entity:"lineage", entity_id: id, summary: `Delete lineage ${id}`}); } catch {}
  fillParents();
  render();
}

document.addEventListener("DOMContentLoaded", ()=>{
  fillStrains(); fillParents(); fillBatches(); render();
  document.getElementById("newLineageBtn").addEventListener("click", openNew);
  document.getElementById("saveLineageBtn").addEventListener("click", saveItem);
  ["search","typeFilter","strainFilter"].forEach(id=> document.getElementById(id).addEventListener("input", render));
});


function showLabel(rec){
  const area=document.getElementById("labelArea");
  if(!area) return;
  area.classList.remove("d-none");
  area.innerHTML="";
  const payloadObj = {
    type: "lineage",
    id: rec.id,
    record_type: rec.type,
    strain_id: rec.strain_id||"",
    batch_id: rec.batch_id||"",
    parent_id: rec.parent_id||"",
    date: rec.date||"",
    notes: rec.notes||""
  };
  const qrValue = buildQrPayload(payloadObj);
  const card=document.createElement("div");
  card.className="card p-3";
  card.innerHTML = `
    <div class="d-flex justify-content-between align-items-start">
      <div>
        <div class="h5 mb-0">${esc(rec.type)} • ${esc(rec.id)}</div>
        <div class="text-muted small">Date: ${esc(rec.date||"")} ${rec.batch_id?`• Batch: ${esc(rec.batch_id)}`:""} ${rec.strain_id?`• Strain: ${esc(rec.strain_id)}`:""}</div>
      </div>
      <div id="qr"></div>
    </div>
    <hr>
    <div class="small text-muted">${esc(rec.notes||"")}</div>
    <div class="mt-3 no-print d-flex gap-2">
      <button class="btn btn-outline-secondary btn-sm" id="hideLabelBtn">Close</button>
      <button class="btn btn-primary btn-sm" onclick="window.print()">Print</button>
    </div>
  `;
  area.appendChild(card);
  const qrEl=card.querySelector("#qr");
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
