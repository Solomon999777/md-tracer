import { load, save, uid, todayISO, computeSupplyOnHand, toBaseQty, displayQtyForSupply, fmtQty, normalizeSupply, logActivity, can } from "./store.js";

const batchesKey = "mdt_batches_v1";
const suppliesKey = "mdt_supplies_v1";
const txKey = "mdt_supply_transactions_v1";


function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}

const cfg = window.STAGE_CONFIG;
if (!cfg || !cfg.key) {
  console.error("Missing STAGE_CONFIG");
}

let editId = null;

let consumeForLogId = null;

function getSupplies(){
  return load(suppliesKey, []);
}
function getTxs(){
  return load(txKey, []);
}
function setTxs(list){
  save(txKey, list);
}
function onHandBase(supply_item_id){
  return computeSupplyOnHand(supply_item_id);
}

function fillConsumeSupplies(){
  const sel=document.getElementById("consumeSupply");
  if(!sel) return;
  const list=getSupplies().slice().sort((a,b)=> (a.name||"").localeCompare(b.name||""));
  sel.innerHTML = `<option value="">—</option>` + list.map(s=>`<option value="${s.supply_item_id}">${esc(s.name)} (${esc(s.unit_code||"")})</option>`).join("");
}

function openConsumeModal(logItem){
  if(!document.getElementById("consumeModal")) { alert("Consume modal missing on page."); return; }
  consumeForLogId = logItem.id;
  document.getElementById("consumeDate").value = logItem.date || todayISO();
  document.getElementById("consumeQty").value = "";
  document.getElementById("consumeSupply").value = "";
  document.getElementById("consumeNote").value = `${cfg.stage||cfg.title||""} usage for ${logItem.batch_id||""}`.trim();
  document.getElementById("consumeWarn").classList.add("d-none");
  bootstrap.Modal.getOrCreateInstance(document.getElementById("consumeModal")).show();
}

function closeConsumeModal(){
  const m=bootstrap.Modal.getInstance(document.getElementById("consumeModal"));
  if(m) m.hide();
}

function saveConsume(){
  const supply_item_id = Number(document.getElementById("consumeSupply").value||0);
  const qtyRaw = document.getElementById("consumeQty").value;
  const qty = Number(qtyRaw);
  const date = document.getElementById("consumeDate").value || todayISO();
  const note = (document.getElementById("consumeNote").value||"").trim();
  if(!supply_item_id){ alert("Supply required"); return; }
  if(!qtyRaw || Number.isNaN(qty) || qty<=0){ alert("Qty must be > 0"); return; }

  const logItem = getItems().find(x=>x.id===consumeForLogId);
  const sup = getSupplies().find(s=>s.supply_item_id===supply_item_id);
  const supNorm = normalizeSupply(sup||{});
  const unit_code = supNorm.unit_code || "";
  const qtyBase = toBaseQty(qty, unit_code);


  const balBase = onHandBase(supply_item_id);
  const nextBase = balBase - qtyBase;
  if (nextBase < -1e-9) {
    const warn = document.getElementById("consumeWarn");
    const curDisp = displayQtyForSupply(supply_item_id, balBase);
    warn.textContent = `Warning: this would make stock negative (current ${curDisp}).`;
    warn.classList.remove("d-none");
  }

  const tx = {
    id: uid("tx"),
    supply_item_id,
    type: "use",
    qty,
    unit_code,
    base_qty: qtyBase,
    base_unit_code: supNorm.base_unit_code || "",
    date,
    batch_id: logItem?.batch_id || "",
    stage: cfg.stage || cfg.title || "",
    log_id: consumeForLogId,
    note,
    created_at: new Date().toISOString()
  };
  const list=getTxs();
  list.unshift(tx);
  setTxs(list);

  try{
    // audit
    const act = load("mdt_activity_v1", []);
    // minimal activity append (avoid circular import)
    act.unshift({ id: uid("act"), ts: new Date().toISOString(), user_name: (JSON.parse(localStorage.getItem("mdt_users_v1")||"[]").find(u=>u.id===(JSON.parse(localStorage.getItem("mdt_current_user_v1")||"{\"user_id\":\"u_admin\"}").user_id))||{name:"Admin",role:"admin"}).name, role:(JSON.parse(localStorage.getItem("mdt_users_v1")||"[]").find(u=>u.id===(JSON.parse(localStorage.getItem("mdt_current_user_v1")||"{\"user_id\":\"u_admin\"}").user_id))||{name:"Admin",role:"admin"}).role, action:"create", entity:"transactions", entity_id:tx.id, summary:`Consumed ${qty} ${unit_code} of ${sup?.name||""}`, data:tx });
    save("mdt_activity_v1", act.slice(0,2000));
  }catch(e){}

  closeConsumeModal();
  fillConsumeSupplies();
if (document.getElementById('saveConsumeBtn')) document.getElementById('saveConsumeBtn').addEventListener('click', saveConsume);

render();
}


function getBatches(){
  return load(batchesKey, []);
}

function fillBatchFilter(){
  const sel = document.getElementById("batchFilter");
  const batches = getBatches().slice().sort((a,b)=>(a.name||"").localeCompare(b.name||""));
  sel.innerHTML = `<option value="">All batches</option>` + batches.map(b=>`<option value="${esc(b.id)}">${esc(b.name)}${b.strain_name ? " — "+esc(b.strain_name):""}</option>`).join("");
}

function getItems(){
  return load(cfg.key, []);
}

function setItems(items){
  save(cfg.key, items);
}

function rowFor(item){
  const cols = cfg.columns;
  const tds = cols.map(col => {
    let v = item[col.field];
    if (col.format === "bool") v = v ? "Yes" : "No";
    if (typeof col.render === "function") v = col.render(item);
    return `<td>${esc(v ?? "")}</td>`;
  }).join("");
  return `
    <tr>
      ${tds}
      <td class="text-end">
        <button class="btn btn-sm btn-outline-primary me-2" data-action="edit" data-id="${esc(item.id)}">Edit</button>
        <button class="btn btn-sm btn-outline-secondary me-2" data-action="consume" data-id="${esc(item.id)}">Consume</button>
        <button class="btn btn-sm btn-outline-danger" data-action="delete" data-id="${esc(item.id)}">Delete</button>
      </td>
    </tr>`;
}

function matchesSearch(item, q){
  if (!q) return true;
  q = q.toLowerCase();
  const hay = JSON.stringify(item).toLowerCase();
  return hay.includes(q);
}

function render(){
  const tbody = document.getElementById("logBody");
  const batchId = document.getElementById("batchFilter").value || "";
  const q = (document.getElementById("search")?.value || "").trim();
  const items = getItems()
    .filter(x => !batchId || x.batch_id === batchId)
    .filter(x => matchesSearch(x, q))
    .slice()
    .sort((a,b)=> (b.date||"").localeCompare(a.date||""));
  tbody.innerHTML = items.map(rowFor).join("");
}

function openModal(item=null){
  editId = item?.id ?? null;
  document.getElementById("logDate").value = item?.date ?? todayISO();
  // batch optional for some stages (cleaning can be global)
  if (document.getElementById("logBatch")) {
    document.getElementById("logBatch").value = item?.batch_id ?? "";
  }
  for (const f of cfg.fields) {
    const el = document.getElementById(f.id);
    if (!el) continue;
    if (f.type === "checkbox") el.checked = !!item?.[f.field];
    else el.value = item?.[f.field] ?? (f.default ?? "");
  }
  document.getElementById("saveLogBtn").textContent = editId ? "Save" : "Create";
  bootstrap.Modal.getOrCreateInstance(document.getElementById("logModal")).show();
}

function closeModal(){
  const m = bootstrap.Modal.getInstance(document.getElementById("logModal"));
  if (m) m.hide();
}

function validateAndBuild(){
  const date = document.getElementById("logDate").value || todayISO();
  let batch_id = "";
  if (document.getElementById("logBatch")) batch_id = document.getElementById("logBatch").value || "";
  const obj = { id: editId || uid(cfg.idPrefix || "log"), date };
  if (document.getElementById("logBatch")) obj.batch_id = batch_id;

  for (const f of cfg.fields) {
    const el = document.getElementById(f.id);
    if (!el) continue;
    let v;
    if (f.type === "checkbox") v = el.checked;
    else if (f.type === "number") v = el.value === "" ? "" : Number(el.value);
    else v = el.value?.trim?.() ?? el.value;

    if (f.required && (v === "" || v == null)) {
      alert(`${f.label || f.field} is required.`);
      return null;
    }
    if (f.type === "number" && v !== "" && !Number.isNaN(v)) {
      if (typeof f.min === "number" && v < f.min) {
        alert(`${f.label || f.field} must be ≥ ${f.min}${f.unit ? ` ${f.unit}` : ""}.`);
        return null;
      }
      if (typeof f.max === "number" && v > f.max) {
        alert(`${f.label || f.field} must be ≤ ${f.max}${f.unit ? ` ${f.unit}` : ""}.`);
        return null;
      }
    }
    obj[f.field] = v;
  }
  return obj;
}

document.getElementById("saveLogBtn").addEventListener("click", ()=>{
  const built = validateAndBuild();
  if (!built) return;

  const items = getItems();
  const now = new Date().toISOString();
  built.updated_at = now;
  built.created_at = items.find(x=>x.id===built.id)?.created_at ?? now;

  const idx = items.findIndex(x=>x.id===built.id);
  if (idx>=0) items[idx]=built; else items.unshift(built);
  setItems(items);
  closeModal();
  fillConsumeSupplies();
if (document.getElementById('saveConsumeBtn')) document.getElementById('saveConsumeBtn').addEventListener('click', saveConsume);

render();
});

document.getElementById("logBody").addEventListener("click", (e)=>{
  const btn = e.target.closest("button[data-action]");
  if (!btn) return;
  const id = btn.dataset.id;
  const items = getItems();
  const item = items.find(x=>x.id===id);
  if (!item) return;
  if (btn.dataset.action === "edit") openModal(item);
  if (btn.dataset.action === "consume") {
    if (!item.batch_id) { alert('Select/attach a batch to consume supplies.'); return; }
    openConsumeModal(item);
    return;
  }
  if (btn.dataset.action === "delete") {
    if (!confirm("Delete this entry?")) return;
    setItems(items.filter(x=>x.id!==id));
    fillConsumeSupplies();
if (document.getElementById('saveConsumeBtn')) document.getElementById('saveConsumeBtn').addEventListener('click', saveConsume);

render();
  }
});

document.getElementById("batchFilter").addEventListener("change", render);
document.getElementById("search")?.addEventListener("input", render);
document.getElementById("newEntryBtn").addEventListener("click", ()=>openModal(null));

fillBatchFilter();
// Prefill batch filter from URL (?batch=)
try{const sp=new URLSearchParams(window.location.search); const b=sp.get('batch'); if(b){document.getElementById('batchFilter').value=b;}}catch(e){}

// fill modal batch select if exists
if (document.getElementById("logBatch")) {
  const sel=document.getElementById("logBatch");
  const batches=getBatches().slice().sort((a,b)=>(a.name||"").localeCompare(b.name||""));
  sel.innerHTML = `<option value="">—</option>` + batches.map(b=>`<option value="${esc(b.id)}">${esc(b.name)}</option>`).join("");
}

fillConsumeSupplies();
if (document.getElementById('saveConsumeBtn')) document.getElementById('saveConsumeBtn').addEventListener('click', saveConsume);

render();
