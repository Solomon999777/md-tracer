import { load, save, logActivity, can } from "./store.js";

const KEY="mdt_activity_v1";

function esc(s){return String(s??"").replace(/[&<>"']/g,c=>({ "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;" }[c]));}

function render(){
  const q=(document.getElementById("search").value||"").trim().toLowerCase();
  const ef=document.getElementById("entityFilter").value||"";
  const list=load(KEY, []);
  const filtered=list.filter(a=>(!ef || a.entity===ef)).filter(a=>{
    if(!q) return true;
    return JSON.stringify(a).toLowerCase().includes(q);
  });

  const tbody=document.getElementById("activityBody");
  tbody.innerHTML = filtered.map(a=>`
    <tr>
      <td class="text-muted small">${esc(a.ts)}</td>
      <td>${esc(a.user_name)} <span class="badge bg-light text-dark">${esc(a.role)}</span></td>
      <td><span class="badge bg-secondary">${esc(a.action)}</span></td>
      <td>${esc(a.entity)}</td>
      <td class="text-muted small">${esc(a.entity_id)}</td>
      <td>${esc(a.summary)}</td>
    </tr>
  `).join("");

  document.getElementById("count").textContent = `${filtered.length} events`;
}

document.getElementById("search").addEventListener("input", render);
document.getElementById("entityFilter").addEventListener("change", render);

document.getElementById("clearBtn").addEventListener("click", ()=>{
  if(!can("edit","backup") && !can("*","*")) { alert("Not permitted."); return; }
  if(!confirm("Clear activity log?")) return;
  save(KEY, []);
  logActivity({ action:"clear", entity:"activity", summary:"Cleared activity log" });
  render();
});

render();
