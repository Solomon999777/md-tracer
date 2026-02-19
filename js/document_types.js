import { load, save, uid } from "../js/store.js";
const KEY = "mdt_document_types_v1";
let editId = null;

function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}

function render(){
  const tbody = document.getElementById("docTypesBody");
  const items = load(KEY, []).slice().sort((a,b)=> (a.name||"").localeCompare(b.name||""));
  tbody.innerHTML="";
  for(const d of items){
    const tr=document.createElement("tr");
    tr.innerHTML=`
      <td>${escapeHtml(d.name||"")}</td>
      <td>${escapeHtml(d.description||"")}</td>
      <td class="text-end">
        <button class="btn btn-sm btn-outline-primary me-2" data-action="edit" data-id="${d.id}">Edit</button>
        <button class="btn btn-sm btn-outline-danger" data-action="delete" data-id="${d.id}">Delete</button>
      </td>`;
    tbody.appendChild(tr);
  }
}

function openModal(item=null){
  editId=item?.id??null;
  document.getElementById("docTypeName").value=item?.name??"";
  document.getElementById("docTypeDescription").value=item?.description??"";
  document.getElementById("createDocTypeBtn").textContent=editId?"Save":"Create";
  bootstrap.Modal.getOrCreateInstance(document.getElementById("newDocTypeModal")).show();
}
function closeModal(){
  const m=bootstrap.Modal.getInstance(document.getElementById("newDocTypeModal"));
  if(m) m.hide();
}

document.getElementById("createDocTypeBtn").addEventListener("click", ()=>{
  const name=document.getElementById("docTypeName").value.trim();
  const description=document.getElementById("docTypeDescription").value.trim();
  if(!name){alert("Name is required."); return;}
  const items=load(KEY, []);
  const now=new Date().toISOString();
  const obj={id: editId||uid("doctype"), name, description, updated_at: now, created_at: items.find(x=>x.id===editId)?.created_at ?? now};
  const idx=items.findIndex(x=>x.id===obj.id);
  if(idx>=0) items[idx]=obj; else items.unshift(obj);
  save(KEY, items);
  closeModal();
  render();
});

document.getElementById("docTypesBody").addEventListener("click", (e)=>{
  const btn=e.target.closest("button[data-action]");
  if(!btn) return;
  const id=btn.dataset.id;
  const items=load(KEY, []);
  const item=items.find(x=>x.id===id);
  if(!item) return;
  if(btn.dataset.action==="edit") openModal(item);
  if(btn.dataset.action==="delete"){
    if(!confirm(`Delete document type "${item.name}"?`)) return;
    save(KEY, items.filter(x=>x.id!==id));
    render();
  }
});

document.querySelector('button[data-bs-target="#newDocTypeModal"]')?.addEventListener("click", ()=>openModal(null));
render();
