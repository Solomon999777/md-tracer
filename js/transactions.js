import { load, save, uid, todayISO, computeSupplyOnHand, logActivity, can, fmtQty, toBaseQty, displayQtyForSupply, normalizeSupply } from "./store.js";

const SUP_KEY="mdt_supplies_v1";
const TX_KEY="mdt_supply_transactions_v1";
const BATCH_KEY="mdt_batches_v1";

let editId=null;

function esc(s){return String(s??"").replace(/[&<>"']/g,c=>({ "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;" }[c]));}

function supplies(){ return load(SUP_KEY, []); }
function batches(){ return load(BATCH_KEY, []); }
function txs(){ return load(TX_KEY, []); }

function fillSelects(){
  const supSel=document.getElementById("txSupply");
  supSel.innerHTML = `<option value="">—</option>` + supplies().slice().sort((a,b)=>a.name.localeCompare(b.name)).map(s=>`<option value="${s.supply_item_id}">${esc(s.name)} (${esc(s.unit_code||"")})</option>`).join("");

  const bSel=document.getElementById("txBatch");
  bSel.innerHTML = `<option value="">—</option>` + batches().slice().sort((a,b)=>a.name.localeCompare(b.name)).map(b=>`<option value="${esc(b.id)}">${esc(b.name)}</option>`).join("");
}

function render(){
  const q=(document.getElementById("search").value||"").trim().toLowerCase();
  const tf=(document.getElementById("typeFilter").value||"").trim();
  const list=txs().filter(t=>!tf || t.type===tf).filter(t=>{
    if(!q) return true;
    const sup = supplies().find(s=>s.supply_item_id===t.supply_item_id);
    const name = sup?.name || "";
    return (name+" "+JSON.stringify(t)).toLowerCase().includes(q);
  }).slice().sort((a,b)=>(b.date||"").localeCompare(a.date||""));

  const tbody=document.getElementById("txBody");
  tbody.innerHTML = list.map(t=>{
    const sup = supplies().find(s=>s.supply_item_id===t.supply_item_id);
    const badge = t.type==="purchase"||t.type==="adjust" ? "bg-success" : "bg-danger";
    const qty = `${fmtQty(t.qty)} ${esc(t.unit_code||sup?.unit_code||"")}`;
    const actions = can("edit","transactions")||can("*","*") ? `
      <button class="btn btn-sm btn-outline-primary me-2" data-action="edit" data-id="${esc(t.id)}">Edit</button>
      <button class="btn btn-sm btn-outline-danger" data-action="delete" data-id="${esc(t.id)}">Delete</button>` : "";
    return `
      <tr>
        <td class="text-muted small">${esc(t.date||"")}</td>
        <td><span class="badge ${badge}">${esc(t.type)}</span></td>
        <td>${esc(sup?.name||"")}</td>
        <td class="text-end">${qty}</td>
        <td>${esc(t.batch_id||"")}</td>
        <td>${esc(t.stage||"")}</td>
        <td>${esc(t.note||"")}</td>
        <td class="text-end">${actions}</td>
      </tr>`;
  }).join("");
}

function openModal(item=null){
  editId=item?.id ?? null;
  document.getElementById("txDate").value = item?.date ?? todayISO();
  document.getElementById("txType").value = item?.type ?? "use";
  document.getElementById("txQty").value = item?.qty ?? "";
  document.getElementById("txSupply").value = item?.supply_item_id ?? "";
  document.getElementById("txBatch").value = item?.batch_id ?? "";
  document.getElementById("txStage").value = item?.stage ?? "";
  document.getElementById("txNote").value = item?.note ?? "";
  document.getElementById("txWarn").classList.add("d-none");
  bootstrap.Modal.getOrCreateInstance(document.getElementById("txModal")).show();
}

function closeModal(){
  const m=bootstrap.Modal.getInstance(document.getElementById("txModal"));
  if(m) m.hide();
}

function validate(){
  const date=document.getElementById("txDate").value||todayISO();
  const type=document.getElementById("txType").value;
  const qtyRaw=document.getElementById("txQty").value;
  const supply_item_id=Number(document.getElementById("txSupply").value||0);
  const batch_id=document.getElementById("txBatch").value||"";
  const stage=document.getElementById("txStage").value||"";
  const note=(document.getElementById("txNote").value||"").trim();
  const qty=Number(qtyRaw);
  if(!supply_item_id){ alert("Supply is required"); return null; }
  if(!qtyRaw || Number.isNaN(qty)){ alert("Qty is required"); return null; }

  const sup=supplies().find(s=>s.supply_item_id===supply_item_id);
  const supNorm = normalizeSupply(sup||{});
  const unit_code = supNorm.unit_code || "";
  const qty_base = toBaseQty(qty, unit_code);


  // warn negative stock
  const bal=computeSupplyOnHand(supply_item_id);
  let next=bal;
  if(type==="purchase"||type==="adjust") next += qty;
  else next -= qty;

  if(nextBase < -1e-9){
    const warn=document.getElementById("txWarn");
    warn.textContent = (() => { const curDisp = displayQtyForSupply(supNorm, balBase); return `Warning: this would make stock negative (current ${fmtQty(curDisp)} ${unit_code}).`; })();
    warn.classList.remove("d-none");
  }

  return { id: editId || uid("tx"), date, type, qty, unit_code, base_qty: qty_base, base_unit_code: supNorm.base_unit_code || "", supply_item_id, batch_id, stage, note };
}

document.getElementById("newTxBtn").addEventListener("click", ()=>{
  if(!can("create","transactions") && !can("*","*")){ alert("Not permitted."); return; }
  openModal(null);
});

document.getElementById("saveTxBtn").addEventListener("click", ()=>{
  if(!can("create","transactions") && !can("edit","transactions") && !can("*","*")){ alert("Not permitted."); return; }
  const built=validate(); if(!built) return;
  const list=txs();
  const now=new Date().toISOString();
  built.updated_at=now;
  built.created_at=list.find(x=>x.id===built.id)?.created_at ?? now;

  const idx=list.findIndex(x=>x.id===built.id);
  if(idx>=0) list[idx]=built; else list.unshift(built);
  save(TX_KEY, list);

  logActivity({ action: idx>=0?"update":"create", entity:"transactions", entity_id: built.id, summary: `${built.type} ${built.qty} ${built.unit_code} (supply ${built.supply_item_id})`, data: built });

  closeModal(); render();
});

document.getElementById("txBody").addEventListener("click",(e)=>{
  const btn=e.target.closest("button[data-action]"); if(!btn) return;
  const id=btn.dataset.id;
  const list=txs();
  const item=list.find(x=>x.id===id); if(!item) return;
  if(btn.dataset.action==="edit") {
    if(!can("edit","transactions") && !can("*","*")){ alert("Not permitted."); return; }
    openModal(item);
  }
  if(btn.dataset.action==="delete"){
    if(!can("edit","transactions") && !can("*","*")){ alert("Not permitted."); return; }
    if(!confirm("Delete this transaction?")) return;
    save(TX_KEY, list.filter(x=>x.id!==id));
    logActivity({ action:"delete", entity:"transactions", entity_id:id, summary:"Deleted transaction", data:item });
    render();
  }
});

document.getElementById("search").addEventListener("input", render);
document.getElementById("typeFilter").addEventListener("change", render);

fillSelects();
render();
