const PREFIX = "mdt_";
const SKIP = new Set(["mdt_last_scan_value"]);

function getAllMDT(){
  const out = {};
  for(let i=0;i<localStorage.length;i++){
    const k = localStorage.key(i);
    if(!k) continue;
    if(!k.startsWith(PREFIX) || SKIP.has(k)) continue;
    out[k] = localStorage.getItem(k);
  }
  return out;
}

function setAllMDT(obj){
  for(const [k,v] of Object.entries(obj)){
    if(!k.startsWith(PREFIX) || SKIP.has(k)) continue;
    localStorage.setItem(k, v);
  }
}

function download(filename, text){
  const blob = new Blob([text], {type:"application/json"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(()=>{ URL.revokeObjectURL(a.href); a.remove(); }, 0);
}

function listKeys(){
  const keys = Object.keys(getAllMDT()).sort();
  document.getElementById("keysBox").textContent = keys.join("\n");
}

document.getElementById("btnExport").addEventListener("click", ()=>{
  const now = new Date();
  const stamp = now.toISOString().slice(0,19).replace(/[:T]/g,'-');
  const payload = {
    version: 1,
    exported_at: now.toISOString(),
    data: getAllMDT(),
  };
  download(`md_tracer_backup_${stamp}.json`, JSON.stringify(payload, null, 2));
  window.showToast?.("Exported backup file.", "success");
});

document.getElementById("btnImport").addEventListener("click", async ()=>{
  const file = document.getElementById("fileImport").files?.[0];
  if(!file){
    window.showToast?.("Choose a JSON file first.", "warning");
    return;
  }
  try{
    const txt = await file.text();
    const obj = JSON.parse(txt);
    if(!obj?.data || typeof obj.data !== "object") throw new Error("Invalid backup format");
    setAllMDT(obj.data);
    listKeys();
    window.showToast?.("Imported backup successfully.", "success");
  }catch(e){
    console.error(e);
    window.showToast?.("Import failed: " + (e.message||"Unknown error"), "danger");
  }
});

document.getElementById("btnClear").addEventListener("click", ()=>{
  if(!confirm("Clear local MD Tracer data from this browser?")) return;
  const keys = Object.keys(getAllMDT());
  for(const k of keys) localStorage.removeItem(k);
  listKeys();
  window.showToast?.("Cleared local data.", "warning");
});

// Bridge: common.js defines showToast but it's not exported. We use window.showToast.
document.addEventListener("DOMContentLoaded", listKeys);
