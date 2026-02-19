import { load, save, uid } from "../js/store.js";
const KEY="mdt_requirements_v1";
let editId=null;

function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}

function render(){
  const tbody=document.getElementById("reqBody");
  const items=load(KEY, []).slice().sort((a,b)=> (a.area||"").localeCompare(b.area||"") || (a.severity||"").localeCompare(b.severity||""));
  tbody.innerHTML="";
  for(const r of items){
    const badge = r.severity==="must" ? "danger" : (r.severity==="should" ? "warning" : "secondary");
    const tr=document.createElement("tr");
    tr.innerHTML=`
      <td>${esc(r.area||"")}</td>
      <td>${esc(r.requirement||"")}</td>
      <td><span class="badge bg-${badge}">${esc(r.severity||"")}</span></td>
      <td class="text-end">
        <button class="btn btn-sm btn-outline-primary me-2" data-action="edit" data-id="${r.id}">Edit</button>
        <button class="btn btn-sm btn-outline-danger" data-action="delete" data-id="${r.id}">Delete</button>
      </td>`;
    tbody.appendChild(tr);
  }
}

function openModal(item=null){
  editId=item?.id??null;
  document.getElementById("reqArea").value=item?.area??"";
  document.getElementById("reqText").value=item?.requirement??"";
  document.getElementById("reqSeverity").value=item?.severity??"must";
  document.getElementById("saveReqBtn").textContent=editId?"Save":"Create";
  bootstrap.Modal.getOrCreateInstance(document.getElementById("reqModal")).show();
}
function closeModal(){
  const m=bootstrap.Modal.getInstance(document.getElementById("reqModal"));
  if(m) m.hide();
}

document.getElementById("saveReqBtn").addEventListener("click", ()=>{
  const area=document.getElementById("reqArea").value.trim();
  const requirement=document.getElementById("reqText").value.trim();
  const severity=document.getElementById("reqSeverity").value;
  if(!area || !requirement){alert("Area and requirement are required."); return;}
  const items=load(KEY, []);
  const now=new Date().toISOString();
  const obj={id: editId||uid("req"), area, requirement, severity, updated_at: now, created_at: items.find(x=>x.id===editId)?.created_at ?? now};
  const idx=items.findIndex(x=>x.id===obj.id);
  if(idx>=0) items[idx]=obj; else items.unshift(obj);
  save(KEY, items);
  closeModal();
  render();
});

document.getElementById("reqBody").addEventListener("click",(e)=>{
  const btn=e.target.closest("button[data-action]");
  if(!btn) return;
  const id=btn.dataset.id;
  const items=load(KEY, []);
  const item=items.find(x=>x.id===id);
  if(!item) return;
  if(btn.dataset.action==="edit") openModal(item);
  if(btn.dataset.action==="delete"){
    if(!confirm("Delete this requirement?")) return;
    save(KEY, items.filter(x=>x.id!==id));
    render();
  }
});

document.querySelector('button[data-bs-target="#reqModal"]')?.addEventListener("click", ()=>openModal(null));
render();
