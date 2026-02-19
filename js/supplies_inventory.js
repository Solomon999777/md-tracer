// Supplies inventory UI logic (localStorage-backed)
(function () {
  const KEY = "mdt_supplies_v1";
  const TX_KEY = "mdt_supply_transactions_v1";

  function getTxs(){
    const raw = localStorage.getItem(TX_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  function onHandBaseFor(supply_item_id){
  const txs = getTxs();
  const supplies = getSupplies();
  const sup = supplies.find(s=>s.supply_item_id===supply_item_id) || {};
  const unit = (sup.base_unit_code || (["kg","g"].includes((sup.unit_code||"").toLowerCase()) ? "g" : (["l","ml"].includes((sup.unit_code||"").toLowerCase()) ? "ml" : (sup.unit_code||""))));
  const toBase = (q,u)=>{u=String(u||unit).toLowerCase(); q=Number(q||0); if(Number.isNaN(q)) return 0; if(u==="kg"||u==="l") return q*1000; return q;};
  let bal = 0;
  for(const t of txs){
    if(t.supply_item_id !== supply_item_id) continue;
    const qBase = (t.base_qty != null) ? Number(t.base_qty||0) : toBase(t.qty||0, t.unit_code||unit);
    if(t.type === "purchase" || t.type === "adjust") bal += qBase;
    else if(t.type === "use" || t.type === "writeoff") bal -= qBase;
  }
  return bal; // base units
}

function toDisplay(baseQty, unit_code){
  const u=String(unit_code||"").toLowerCase();
  const q=Number(baseQty||0);
  if(u==="kg"||u==="l") return q/1000;
  return q;
}


  function fmt(n) {
    if (typeof n !== "number" || Number.isNaN(n)) return "0";
    const abs = Math.abs(n);
    const decimals = abs >= 100 ? 0 : abs >= 10 ? 1 : 3;
    return n.toLocaleString(undefined, { maximumFractionDigits: decimals });
  }

  function getSupplies() {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  }

  function unique(arr) {
    return Array.from(new Set(arr)).sort((a, b) => (a > b ? 1 : -1));
  }

  function statusFor(item) {
    return onHandBaseFor(item.supply_item_id) > 0 ? "In Stock" : "Out of Stock";
  }

  function statusClass(item) {
    return onHandBaseFor(item.supply_item_id) > 0 ? "bg-success" : "bg-secondary";
  }

  function buildCategoryMap(items) {
    // Best-effort: derive labels from category_id if we don't have a master list yet.
    // You can later replace this with your real category table.
    const defaults = {
      7: "Production Inputs",
      11: "Sanitation & Chemicals",
      18: "Packaging",
      20: "Water & Filtration",
      21: "Cultures"
    };
    const map = {};
    for (const it of items) map[it.category_id] = defaults[it.category_id] || `Category ${it.category_id}`;
    return map;
  }

  function render() {
    const items = getSupplies();
    const catMap = buildCategoryMap(items);

    const q = (document.getElementById("q").value || "").toLowerCase().trim();
    const cat = document.getElementById("cat").value || "";
    const show = document.getElementById("show").value || "all";

    let filtered = items.filter(it => {
      const matchesQ = !q || it.name.toLowerCase().includes(q);
      const matchesCat = !cat || String(it.category_id) === cat;
      const st = statusFor(it);
      const matchesShow = show === "all" || (show === "in" && st === "In Stock") || (show === "out" && st === "Out of Stock");
      return matchesQ && matchesCat && matchesShow;
    });

    // sort by on-hand asc, then name
    filtered.sort((a, b) => (onHandBaseFor(a.supply_item_id) - onHandBaseFor(b.supply_item_id)) || a.name.localeCompare(b.name));

    const tbody = document.getElementById("tbody");
    tbody.innerHTML = "";

    if (!filtered.length) {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td colspan="8" class="text-center text-muted py-4">No items match your filters.</td>`;
      tbody.appendChild(tr);
      return;
    }

    for (const it of filtered) {
      const tr = document.createElement("tr");
      tr.className = "align-middle";
      tr.innerHTML = `
        <td class="text-muted">${it.supply_item_id}</td>
        <td>
          <div class="fw-semibold">${it.name}</div>
          <div class="small text-muted">${catMap[it.category_id]}</div>
        </td>
        <td><span class="badge ${statusClass(it)}">${statusFor(it)}</span></td>
        <td class="text-end">${fmt(onHandBaseFor(it.supply_item_id)) <span class="text-muted">${it.unit_code}</span></td>
        <td class="text-end">${fmt(it.purchased_qty)}</td>
        <td class="text-end">${fmt(it.used_qty)}</td>
        <td class="text-end">${fmt(it.written_off_qty)}</td>
        <td class="text-end"><button class="btn btn-sm btn-outline-primary" data-id="${it.supply_item_id}">Details</button></td>
      `;
      tbody.appendChild(tr);
    }

    document.getElementById("count").textContent = `${filtered.length} item(s)`;
  }

  function showDetails(id) {
    const items = getSupplies();
    const it = items.find(x => String(x.supply_item_id) === String(id));
    if (!it) return;

    const modalEl = document.getElementById("detailsModal");
    document.getElementById("d_name").textContent = it.name;
    document.getElementById("d_id").textContent = it.supply_item_id;
    document.getElementById("d_cat").textContent = it.category_id;
    document.getElementById("d_unit").textContent = it.unit_code;
    document.getElementById("d_onhand").textContent = `${fmt(onHandBaseFor(it.supply_item_id))} ${it.unit_code}`;
    document.getElementById("d_purchased").textContent = it.purchased_qty;
    document.getElementById("d_used").textContent = it.used_qty;
    document.getElementById("d_written").textContent = it.written_off_qty;

    const modal = new bootstrap.Modal(modalEl);
    modal.show();
  }

  function initFilters() {
    const items = getSupplies();
    const cats = unique(items.map(x => String(x.category_id)));
    const sel = document.getElementById("cat");
    for (const c of cats) {
      const opt = document.createElement("option");
      opt.value = c;
      opt.textContent = c;
      sel.appendChild(opt);
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    // Prefill search from URL (?q=) or last scan
    const sp = new URLSearchParams(window.location.search);
    const qParam = sp.get('q');
    if (qParam) { document.getElementById('q').value = qParam; }
    else {
      try{ const last = JSON.parse(localStorage.getItem('mdt_last_scan_value')||'null');
        if(last?.value) { /* keep empty by default; user can Ctrl+K */ }
      }catch{}
    }
    initFilters();
    render();

    document.getElementById("q").addEventListener("input", render);
    document.getElementById("cat").addEventListener("change", render);
    document.getElementById("show").addEventListener("change", render);

    document.getElementById("tbody").addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-id]");
      if (!btn) return;
      showDetails(btn.getAttribute("data-id"));
    });
  });
})();
