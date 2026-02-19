import { load, computeSupplyOnHand } from "./store.js";

const BATCH="mdt_batches_v1";
const ISS="mdt_issues_v1";
const ACT="mdt_activity_v1";
const SUP="mdt_supplies_v1";

const stages = [
  { key:"mdt_stage_preparation_v1", slug:"preparation", title:"Preparation", href:"preparation.html" },
  { key:"mdt_stage_inoculation_v1", slug:"inoculation", title:"Inoculation", href:"inoculation.html" },
  { key:"mdt_stage_incubation_v1", slug:"incubation", title:"Incubation", href:"incubation.html" },
  { key:"mdt_stage_fruiting_v1", slug:"fruiting", title:"Fruiting", href:"fruiting.html" },
  { key:"mdt_stage_harvest_v1", slug:"harvest", title:"Harvest", href:"harvest.html" },
  { key:"mdt_stage_qa_v1", slug:"qa", title:"QA", href:"qa.html" },
];

function esc(s){return String(s??"").replace(/[&<>"']/g,c=>({ "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;" }[c]));}

function countByBatchInStage(stageKey){
  const logs=load(stageKey, []);
  const set=new Set(logs.map(l=>l.batch_id).filter(Boolean));
  return set.size;
}

function render(){
  const batches=load(BATCH, []);
  const issues=load(ISS, []);
  const activity=load(ACT, []);
  const supplies=load(SUP, []);

  const activeBatches=batches.filter(b=>b.status && b.status!=="Completed");
  const openIssues=issues.filter(i=>i.status!=="closed");
  const criticalIssues=openIssues.filter(i=>i.severity==="critical"||i.severity==="high");

  // Low stock (anything <=0)
  const low = supplies.filter(s=>computeSupplyOnHand(s.supply_item_id) <= 0);

  const kpis=document.getElementById("kpis");
  kpis.innerHTML = `
    <div class="col-md-3"><div class="card shadow-sm stage-card"><div class="card-body"><div class="mini">Active batches</div><div class="kpi">${activeBatches.length}</div></div></div></div>
    <div class="col-md-3"><div class="card shadow-sm stage-card"><div class="card-body"><div class="mini">Open issues</div><div class="kpi">${openIssues.length}</div></div></div></div>
    <div class="col-md-3"><div class="card shadow-sm stage-card"><div class="card-body"><div class="mini">High/Critical</div><div class="kpi">${criticalIssues.length}</div></div></div></div>
    <div class="col-md-3"><div class="card shadow-sm stage-card"><div class="card-body"><div class="mini">Out of stock</div><div class="kpi">${low.length}</div></div></div></div>
  `;

  const stagesEl=document.getElementById("stages");
  stagesEl.innerHTML = stages.map(s=>{
    const c=countByBatchInStage(s.key);
    return `
      <div class="col-md-4">
        <a href="${esc(s.href)}" class="card shadow-sm stage-card text-decoration-none text-dark">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <h5 class="mb-0">${esc(s.title)}</h5>
              <span class="badge bg-primary">${c}</span>
            </div>
            <div class="text-muted small mt-1">Batches with logs in this stage</div>
          </div>
        </a>
      </div>`;
  }).join("");

  const att=document.getElementById("attention");
  const items=[];
  if(criticalIssues.length){
    items.push(`<li><strong>${criticalIssues.length}</strong> high/critical issues need review (see Issues).</li>`);
  }
  if(low.length){
    items.push(`<li><strong>${low.length}</strong> supplies are out of stock (see Warehouse → Supplies).</li>`);
  }
  // QA due: batches with harvest lots held or without QA logs
  const qaLogs=load("mdt_stage_qa_v1", []);
  const qaSet=new Set(qaLogs.map(l=>l.batch_id).filter(Boolean));
  const qaDue=activeBatches.filter(b=>!qaSet.has(b.id));
  if(qaDue.length){
    items.push(`<li><strong>${qaDue.length}</strong> active batches have no QA entry yet.</li>`);
  }
  att.innerHTML = items.length ? items.join("") : "<li class='text-muted'>No urgent items.</li>";

  const recent=document.getElementById("recent");
  recent.innerHTML = activity.slice(0,8).map(a=>`<li><span class="text-muted small">${esc(a.ts.slice(0,19).replace("T"," "))}</span> — ${esc(a.user_name)}: ${esc(a.summary||a.action)}</li>`).join("") || "<li class='text-muted'>No activity yet.</li>";
}

render();
