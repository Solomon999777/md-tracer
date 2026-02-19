// Simple LocalStorage-backed store for MD Tracer (static sites)
export function load(key, fallback = []) {
  const raw = localStorage.getItem(key);
  if (!raw) return structuredClone(fallback);
  try { return JSON.parse(raw); } catch { return structuredClone(fallback); }
}

export function save(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

export function upsertById(list, item, idField = "id") {
  const idx = list.findIndex(x => x[idField] === item[idField]);
  if (idx >= 0) list[idx] = item;
  else list.unshift(item);
  return list;
}

export function removeById(list, id, idField = "id") {
  return list.filter(x => x[idField] !== id);
}

export function fmtQty(n, decimals=3) {
  const num = Number(n);
  if (Number.isNaN(num)) return "";
  return num.toLocaleString(undefined, { maximumFractionDigits: decimals });
}


// --- Units & Conversions ---
// Supports basic mass/volume conversions for common ops.
// We store transaction quantities in a base unit when possible:
// mass -> g, volume -> ml. Display uses the supply's preferred unit.
export function unitDimension(unit_code){
  const u = String(unit_code||"").toLowerCase();
  if (["g","kg"].includes(u)) return "mass";
  if (["ml","l"].includes(u)) return "volume";
  return "other";
}
export function baseUnit(unit_code){
  const dim = unitDimension(unit_code);
  if (dim==="mass") return "g";
  if (dim==="volume") return "ml";
  return String(unit_code||"");
}
export function toBaseQty(qty, unit_code){
  const u = String(unit_code||"").toLowerCase();
  const q = Number(qty||0);
  if (Number.isNaN(q)) return 0;
  if (u==="kg") return q*1000;
  if (u==="l") return q*1000;
  return q; // g, ml, other
}
export function fromBaseQty(baseQty, displayUnit){
  const u = String(displayUnit||"").toLowerCase();
  const q = Number(baseQty||0);
  if (Number.isNaN(q)) return 0;
  if (u==="kg") return q/1000;
  if (u==="l") return q/1000;
  return q;
}
export function normalizeSupply(s){
  // Adds base_unit_code and dimension fields if missing
  const unit = s?.unit_code || "";
  return { ...s, dimension: s.dimension || unitDimension(unit), base_unit_code: s.base_unit_code || baseUnit(unit) };
}
export function displayQtyForSupply(supply, baseQty){
  const s = normalizeSupply(supply||{});
  return fromBaseQty(baseQty, s.unit_code || s.base_unit_code);
}

export function todayISO() {
  const d = new Date();
  const pad = (x)=>String(x).padStart(2,'0');
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
}


// --- Users / Roles / Activity Log ---
export function currentUser() {
  try {
    const cur = load("mdt_current_user_v1", { user_id: "u_admin" });
    const users = load("mdt_users_v1", []);
    return users.find(u => u.id === cur.user_id) || users[0] || { id: "u_admin", name: "Admin", role: "admin" };
  } catch {
    return { id: "u_admin", name: "Admin", role: "admin" };
  }
}

export function setCurrentUser(user_id) {
  save("mdt_current_user_v1", { user_id });
}

export function hasRole(role) {
  const u = currentUser();
  return u.role === role;
}

export function can(action, resource) {
  // Simple RBAC
  const role = currentUser().role || "operator";
  const rules = {
    admin: { "*": ["*"] },
    qa: {
      "*": ["view"],
      batches: ["view", "edit", "qa_signoff"],
      issues: ["view", "create", "edit"],
      stage_logs: ["view"],
      harvest_lots: ["view", "edit", "release"],
      backup: ["view", "export", "import"]
    },
    operator: {
      "*": ["view"],
      stage_logs: ["view", "create", "edit"],
      batches: ["view", "create", "edit"],
      harvest_lots: ["view", "create", "edit"],
      scanner: ["view"],
      supplies: ["view"],
      transactions: ["view", "create"],
      backup: ["view", "export"]
    }
  };
  const allow = rules[role] || rules.operator;
  const res = allow[resource] || allow["*"] || [];
  const allowed = res.includes("*") || res.includes(action);
  if (allow["*"]?.includes("*")) return true;
  return allowed;
}

export function logActivity({ action, entity, entity_id="", summary="", data=null }) {
  const key = "mdt_activity_v1";
  const list = load(key, []);
  const u = currentUser();
  list.unshift({
    id: uid("act"),
    ts: new Date().toISOString(),
    user_id: u.id,
    user_name: u.name,
    role: u.role,
    action, entity, entity_id, summary,
    data
  });
  save(key, list.slice(0, 2000)); // keep last 2000
}

export function computeSupplyOnHand(supply_item_id) {
  const txs = load("mdt_supply_transactions_v1", []);
  const supplies = load("mdt_supplies_v1", []);
  const sup = supplies.find(s=>s.supply_item_id===supply_item_id);
  const base = baseUnit(sup?.unit_code || sup?.base_unit_code || "");
  let balBase = 0;
  for (const t of txs) {
    if (t.supply_item_id !== supply_item_id) continue;
    const qBase = (t.base_qty != null) ? Number(t.base_qty||0) : toBaseQty(t.qty||0, t.unit_code || base);
    if (t.type === "purchase" || t.type === "adjust") balBase += qBase;
    else if (t.type === "use" || t.type === "writeoff") balBase -= qBase;
  }
  return balBase; // base unit quantity
}


// --- QR Payload Schema ---
// We standardize all QR codes to carry a compact, versioned payload.
// Format: "MDT1." + base64url(JSON)
export const MDT_QR_PREFIX = "MDT1.";

function b64urlEncode(str){
  const b64 = btoa(unescape(encodeURIComponent(str)));
  return b64.replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");
}
function b64urlDecode(b64url){
  const b64 = b64url.replace(/-/g,"+").replace(/_/g,"/") + "===".slice((b64url.length + 3) % 4);
  const str = decodeURIComponent(escape(atob(b64)));
  return str;
}

export function buildQrPayload({ type, id, ...rest }){
  const payload = { m:"MDT", v:1, t:String(type||""), id:String(id||""), ...rest };
  return MDT_QR_PREFIX + b64urlEncode(JSON.stringify(payload));
}

export function parseQrPayload(raw){
  const s = String(raw||"").trim();
  if(!s.startsWith(MDT_QR_PREFIX)) return null;
  try{
    const json = b64urlDecode(s.slice(MDT_QR_PREFIX.length));
    const obj = JSON.parse(json);
    if(obj && obj.m==="MDT" && obj.v===1) return obj;
  }catch(e){}
  return null;
}
