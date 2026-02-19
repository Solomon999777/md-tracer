import { load } from "./store.js";

const STAGE_KEYS = {
  incubation: "mdt_stage_incubation_v1",
  fruiting: "mdt_stage_fruiting_v1"
};

const BATCH_KEY="mdt_batches_v1";

function esc(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));}
function parseDate(d){ return new Date(d||0).getTime(); }

function getBatches(){
  const bs=load(BATCH_KEY, []);
  const m=new Map(bs.map(b=>[b.id,b.name||b.id]));
  return m;
}

function stageConfig(stage){
  // Pull definitions from window.STAGE_CONFIGS if present; otherwise infer from logs.
  // We'll define common metrics here by convention.
  if(stage==="incubation"){
    return [
      { field:"temp_c", label:"Temp (°C)" },
      { field:"rh_pct", label:"RH (%)" },
      { field:"co2_ppm", label:"CO₂ (ppm)" },
      { field:"colonization_pct", label:"Colonization (%)" }
    ];
  }
  return [
    { field:"temp_c", label:"Temp (°C)" },
    { field:"rh_pct", label:"RH (%)" },
    { field:"co2_ppm", label:"CO₂ (ppm)" },
    { field:"fae_per_hour", label:"FAE / hour" }
  ];
}

function getMetricOptions(stage){
  const defs=stageConfig(stage);
  // If logs contain other numeric fields, include them too
  const logs=load(STAGE_KEYS[stage], []);
  const numeric=new Set();
  logs.forEach(l=>{
    Object.entries(l).forEach(([k,v])=>{
      if(typeof v==="number" && !Number.isNaN(v)) numeric.add(k);
    });
  });
  const extra=[...numeric].filter(k=>!defs.some(d=>d.field===k)).map(k=>({field:k,label:k}));
  return defs.concat(extra);
}

function drawLine(canvas, pts, label){
  const ctx=canvas.getContext("2d");
  const w=canvas.width=canvas.clientWidth*devicePixelRatio;
  const h=canvas.height=canvas.clientHeight*devicePixelRatio;
  ctx.clearRect(0,0,w,h);

  const pad=48*devicePixelRatio;
  ctx.font = `${12*devicePixelRatio}px system-ui`;

  if(!pts.length){
    ctx.fillText("No data", pad, pad);
    return;
  }
  const xs=pts.map(p=>p.x);
  const ys=pts.map(p=>p.y);
  const xmin=Math.min(...xs), xmax=Math.max(...xs);
  const ymin=Math.min(...ys), ymax=Math.max(...ys);
  const xspan=(xmax-xmin)||1;
  const yspan=(ymax-ymin)||1;

  const xScale=(x)=> pad + (x-xmin)/xspan*(w-2*pad);
  const yScale=(y)=> (h-pad) - (y-ymin)/yspan*(h-2*pad);

  // axes
  ctx.globalAlpha=0.6;
  ctx.beginPath();
  ctx.moveTo(pad, pad);
  ctx.lineTo(pad, h-pad);
  ctx.lineTo(w-pad, h-pad);
  ctx.stroke();
  ctx.globalAlpha=1;

  // line
  ctx.beginPath();
  pts.forEach((p,i)=>{
    const X=xScale(p.x), Y=yScale(p.y);
    if(i===0) ctx.moveTo(X,Y); else ctx.lineTo(X,Y);
  });
  ctx.stroke();

  // points
  pts.forEach((p)=>{
    const X=xScale(p.x), Y=yScale(p.y);
    ctx.beginPath();
    ctx.arc(X,Y, 2.5*devicePixelRatio, 0, Math.PI*2);
    ctx.fill();
  });

  // labels
  const title = label || "Metric";
  ctx.fillText(title, pad, pad-18*devicePixelRatio);
  ctx.fillText(`${ymin.toFixed(1)} – ${ymax.toFixed(1)}`, w-pad-140*devicePixelRatio, pad-18*devicePixelRatio);
}

function computeAlerts(stage){
  // Basic cultivation heuristics (editable later)
  // returns array of strings
  const alerts=[];
  const logs=load(STAGE_KEYS[stage], []);
  if(!logs.length) return alerts;

  const recent=logs.slice().sort((a,b)=>parseDate(b.date)-parseDate(a.date)).slice(0,50);

  function check(field, min, max, label){
    const bad=recent.filter(l=>typeof l[field]==="number" && (l[field]<min || l[field]>max));
    if(bad.length) alerts.push(`${label}: ${bad.length} recent point(s) outside ${min}–${max}.`);
  }

  if(stage==="incubation"){
    check("temp_c", 20, 28, "Incubation temp");
    check("co2_ppm", 1000, 8000, "Incubation CO₂");
    check("rh_pct", 40, 75, "Incubation RH");
  } else {
    check("temp_c", 14, 22, "Fruiting temp");
    check("co2_ppm", 400, 1500, "Fruiting CO₂");
    check("rh_pct", 85, 98, "Fruiting RH");
  }

  return alerts;
}

function render(){
  const stage=document.getElementById("stageSel").value;
  const metric=document.getElementById("metricSel").value;
  const days=Number(document.getElementById("daysSel").value||14);

  const bs=getBatches();
  const logs=load(STAGE_KEYS[stage], []).slice().filter(l=>l.date).sort((a,b)=>parseDate(a.date)-parseDate(b.date));
  const cutoff=Date.now() - days*24*3600*1000;
  const pts=logs.filter(l=>parseDate(l.date)>=cutoff).filter(l=>typeof l[metric]==="number").map(l=>({
    x: parseDate(l.date),
    y: l[metric],
    date: l.date,
    batch: bs.get(l.batch_id)||l.batch_id||"",
    raw:l
  }));

  // downsample if too many
  const MAX=300;
  const sampled = pts.length>MAX ? pts.filter((_,i)=> i % Math.ceil(pts.length/MAX)===0) : pts;

  drawLine(document.getElementById("chart"), sampled, metric);

  const values=pts.map(p=>p.y);
  const summary=document.getElementById("summary");
  if(values.length){
    const avg=values.reduce((a,b)=>a+b,0)/values.length;
    const min=Math.min(...values), max=Math.max(...values);
    summary.textContent = `Points: ${values.length}. Avg: ${avg.toFixed(2)}. Min: ${min.toFixed(2)}. Max: ${max.toFixed(2)}.`;
  } else {
    summary.textContent="No points in range.";
  }

  const body=document.getElementById("pointsBody");
  body.innerHTML = pts.slice().sort((a,b)=>parseDate(b.date)-parseDate(a.date)).slice(0,12).map(p=>`<tr><td>${esc(p.date)}</td><td>${esc(p.batch)}</td><td class="mono">${esc(p.y)}</td></tr>`).join("");

  const alerts=computeAlerts(stage);
  document.getElementById("alerts").innerHTML = alerts.length ? `<ul class="mb-0">${alerts.map(a=>`<li>${esc(a)}</li>`).join("")}</ul>` : "No alerts.";
}

function fillMetric(){
  const stage=document.getElementById("stageSel").value;
  const sel=document.getElementById("metricSel");
  const opts=getMetricOptions(stage);
  sel.innerHTML = opts.map(o=>`<option value="${esc(o.field)}">${esc(o.label)}</option>`).join("");
}

document.addEventListener("DOMContentLoaded", ()=>{
  fillMetric();
  render();
  document.getElementById("stageSel").addEventListener("change", ()=>{ fillMetric(); render(); });
  document.getElementById("metricSel").addEventListener("change", render);
  document.getElementById("daysSel").addEventListener("change", render);
  window.addEventListener("resize", ()=>render());
});
