import { load, save, uid, todayISO, logActivity, can } from "./store.js";

const KEY="mdt_issues_v1";
const BATCH_KEY="mdt_batches_v1";

let editId=null;
    attachmentsDraft=[];
    renderPhotoPreview();
let attachmentsDraft=[];

function esc(s){return String(s??"").replace(/[&<>"']/g,c=>({ "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;" }[c]));}


async function fileToCompressedDataUrl(file){
  // Compress images to keep localStorage reasonable
  const maxDim = 1024;
  const quality = 0.82;
  const dataUrl = await new Promise((res, rej)=>{
    const fr=new FileReader();
    fr.onload=()=>res(fr.result);
    fr.onerror=()=>rej(fr.error);
    fr.readAsDataURL(file);
  });

  const img = await new Promise((res, rej)=>{
    const i=new Image();
    i.onload=()=>res(i);
    i.onerror=()=>rej(new Error("Image load failed"));
    i.src=dataUrl;
  });

  const canvas=document.createElement("canvas");
  let {width:w, height:h} = img;
  const scale = Math.min(1, maxDim/Math.max(w,h));
  w=Math.round(w*scale); h=Math.round(h*scale);
  canvas.width=w; canvas.height=h;
  const ctx=canvas.getContext("2d");
  ctx.drawImage(img,0,0,w,h);
  // Convert to JPEG to reduce size
  return canvas.toDataURL("image/jpeg", quality);
}

function renderPhotoPreview(){
  const wrap=document.getElementById("issPhotoPreview");
  if(!wrap) return;
  wrap.innerHTML = attachmentsDraft.map((a,idx)=>`
    <div class="border rounded p-1">
      <img src="${a.dataUrl}" alt="photo" style="width:120px;height:90px;object-fit:cover;border-radius:6px;display:block"/>
      <button class="btn btn-sm btn-outline-danger mt-1 w-100" data-photo-remove="${idx}">Remove</button>
    </div>
  `).join("");
  wrap.querySelectorAll("[data-photo-remove]").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const i=Number(btn.getAttribute("data-photo-remove"));
      attachmentsDraft = attachmentsDraft.filter((_,j)=>j!==i);
      renderPhotoPreview();
    });
  });
}
function batches(){ return load(BATCH_KEY, []); }
function issues(){ return load(KEY, []); }

function fillBatches(){
  const sel=document.getElementById("batchFilter");
  const sel2=document.getElementById("issBatch");
  const list=batches().slice().sort((a,b)=>(a.name||"").localeCompare(b.name||""));
  const opts = `<option value="">All batches</option>` + list.map(b=>`<option value="${esc(b.id)}">${esc(b.name)}</option>`).join("");
  sel.innerHTML = opts;
  sel2.innerHTML = `<option value="">—</option>` + list.map(b=>`<option value="${esc(b.id)}">${esc(b.name)}</option>`).join("");
}

function matches(it,q){
  if(!q) return true;
  q=q.toLowerCase();
  return JSON.stringify(it).toLowerCase().includes(q);
}

function render(){
  const bf=document.getElementById("batchFilter").value||"";
  const sf=document.getElementById("statusFilter").value||"";
  const q=(document.getElementById("search").value||"").trim();
  const list=issues().filter(i=>!bf||i.batch_id===bf).filter(i=>!sf||i.status===sf).filter(i=>matches(i,q))
    .slice().sort((a,b)=>(b.date||"").localeCompare(a.date||""));
  const tbody=document.getElementById("issuesBody");
  tbody.innerHTML = list.map(i=>{
    const sevClass = i.severity==="critical"||i.severity==="high" ? "bg-danger" : i.severity==="medium" ? "bg-warning text-dark" : "bg-secondary";
    const stClass = i.status==="closed" ? "bg-success" : i.status==="monitoring" ? "bg-info text-dark" : "bg-warning text-dark";
    const actions = (can("edit","issues")||can("*","*") ) ? `
      <button class="btn btn-sm btn-outline-primary me-2" data-action="edit" data-id="${esc(i.id)}">Edit</button>
      <button class="btn btn-sm btn-outline-danger" data-action="delete" data-id="${esc(i.id)}">Delete</button>` : "";
    return `
      <tr>
        <td class="text-muted small">${esc(i.date)}</td>
        <td>${esc(i.batch_id||"")}</td>
        <td>${esc(i.stage||"")}</td>
        <td>${esc(i.type||"")}</td>
        <td><span class="badge ${sevClass}">${esc(i.severity||"")}</span></td>
        <td><span class="badge ${stClass}">${esc(i.status||"")}</span></td>
        <td>${esc(i.suspected_source||"")}</td>
        <td>${esc(i.corrective_action||"")}</td>
        <td class="text-end">${actions}</td>
      </tr>`;
  }).join("");
}

function openModal(item=null){
  editId=item?.id ?? null;
  document.getElementById("issDate").value = item?.date ?? todayISO();
  document.getElementById("issBatch").value = item?.batch_id ?? "";
  document.getElementById("issStage").value = item?.stage ?? "incubation";
  document.getElementById("issType").value = item?.type ?? "other";
  document.getElementById("issSeverity").value = item?.severity ?? "medium";
  document.getElementById("issStatus").value = item?.status ?? "open";
  document.getElementById("issSource").value = item?.suspected_source ?? "";
  document.getElementById("issAction").value = item?.corrective_action ?? "";
  document.getElementById("issNotes").value = item?.notes ?? "";
  document.getElementById("issWarn").classList.add("d-none");
  bootstrap.Modal.getOrCreateInstance(document.getElementById("issueModal")).show();
}

function validate(){
  const date=document.getElementById("issDate").value||todayISO();
  const batch_id=document.getElementById("issBatch").value||"";
  const stage=document.getElementById("issStage").value||"";
  const type=document.getElementById("issType").value||"";
  const severity=document.getElementById("issSeverity").value||"";
  const status=document.getElementById("issStatus").value||"open";
  const suspected_source=(document.getElementById("issSource").value||"").trim();
  const corrective_action=(document.getElementById("issAction").value||"").trim();
  const notes=(document.getElementById("issNotes").value||"").trim();
  if(!batch_id){ alert("Batch required"); return null; }
  return { id: editId || uid("iss"), date, batch_id, stage, type, severity, status, suspected_source, corrective_action, notes };
}

document.getElementById("newIssueBtn").addEventListener("click", ()=>{
  if(!can("create","issues") && !can("*","*")){ alert("Not permitted."); return; }
  openModal(null);
});

document.getElementById("saveIssueBtn").addEventListener("click", ()=>{
  if(!can("create","issues") && !can("edit","issues") && !can("*","*")){ alert("Not permitted."); return; }
  const built=validate(); if(!built) return;
  const list=issues();
  const now=new Date().toISOString();
  built.updated_at=now;
  built.created_at=list.find(x=>x.id===built.id)?.created_at ?? now;
  const idx=list.findIndex(x=>x.id===built.id);
  if(idx>=0) list[idx]=built; else list.unshift(built);
  save(KEY, list);
  logActivity({ action: idx>=0?"update":"create", entity:"issues", entity_id: built.id, summary: `${built.type} (${built.severity}) on ${built.batch_id}`, data: built });
  bootstrap.Modal.getInstance(document.getElementById("issueModal"))?.hide();
  render();
});

document.getElementById("issuesBody").addEventListener("click",(e)=>{
  const btn=e.target.closest("button[data-action]"); if(!btn) return;
  const id=btn.dataset.id;
  const list=issues();
  const item=list.find(x=>x.id===id); if(!item) return;
  if(btn.dataset.action==="edit"){ openModal(item); }
  if(btn.dataset.action==="delete"){
    if(!confirm("Delete this issue?")) return;
    save(KEY, list.filter(x=>x.id!==id));
    logActivity({ action:"delete", entity:"issues", entity_id:id, summary:"Deleted issue", data:item });
    render();
  }
});

document.getElementById("batchFilter").addEventListener("change", render);
document.getElementById("statusFilter").addEventListener("change", render);
document.getElementById("search").addEventListener("input", render);

fillBatches();
render();
