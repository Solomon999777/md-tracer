// md-tracer/js/traceback_v2.js
(function () {
  "use strict";

  function h(tag, attrs = {}, children = []) {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === "class") el.className = v;
      else if (k.startsWith("on") && typeof v === "function") el.addEventListener(k.slice(2), v);
      else el.setAttribute(k, v);
    }
    for (const c of children) el.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    return el;
  }

  function getStore() {
    if (!window.StoreV2) throw new Error("StoreV2 not loaded");
    return StoreV2.load();
  }

  // Try multiple possible keys in an object
  function pick(obj, keys, fallback = "") {
    if (!obj || typeof obj !== "object") return fallback;
    for (const k of keys) {
      if (obj[k] != null && String(obj[k]).trim() !== "") return obj[k];
    }
    return fallback;
  }

  function norm(s) {
    return (s ?? "").toString().trim();
  }

  // Find harvest lots related to a batch or a lot id (handles multiple schemas)
  function findHarvestLots(store, { batchId, lotId }) {
    const lots = Array.isArray(store.harvestLots) ? store.harvestLots : [];
    const out = [];

    for (const l of lots) {
      const id = norm(pick(l, ["id", "lotId", "harvestLotId"]));
      const bId = norm(pick(l, ["batchId", "batchID", "sourceBatchId", "parentBatchId"]));

      if (lotId && id === lotId) out.push(l);
      else if (batchId && bId === batchId) out.push(l);
    }
    return out;
  }

  // Find sales orders impacted by a set of harvest lot ids (handles multiple schemas)
  function findSalesOrders(store, lotIds) {
    const orders = Array.isArray(store.salesOrders) ? store.salesOrders : [];
    const impacted = [];

    for (const so of orders) {
      const lines = Array.isArray(so.lines) ? so.lines : (Array.isArray(so.items) ? so.items : []);
      let hit = false;

      for (const ln of lines) {
        const lid = norm(pick(ln, ["lotId", "harvestLotId", "harvestLot", "lot"]));
        if (lid && lotIds.has(lid)) {
          hit = true;
          break;
        }
      }

      // Some schemas store lots at top-level
      if (!hit) {
        const lid2 = norm(pick(so, ["lotId", "harvestLotId"]));
        if (lid2 && lotIds.has(lid2)) hit = true;
      }

      if (hit) impacted.push(so);
    }

    return impacted;
  }

  function renderTraceback(root) {
    const store = getStore();

    const card = h("div", { class: "card mb-3" }, [
      h("div", { class: "card-body" }, [
        h("h3", { class: "card-title mb-2" }, ["Traceback Report"]),
        h("p", { class: "text-muted mb-0" }, [
          "Enter a Batch ID or Harvest Lot ID to generate an impact report (batch → lots → sales orders/customers)."
        ])
      ])
    ]);

    const input = h("input", {
      class: "form-control",
      placeholder: "Batch ID or Harvest Lot ID (e.g., BATCH-001 or LOT-123)"
    });

    const btn = h("button", { class: "btn btn-primary", type: "button" }, ["Generate"]);
    const btnPrint = h("button", { class: "btn btn-outline-secondary", type: "button", disabled: "true" }, ["Print"]);
    const btnBack = h("a", { class: "btn btn-link", href: "index.html" }, ["Documents"]);

    const controls = h("div", { class: "d-flex gap-2 align-items-center" }, [btnBack, input, btn, btnPrint]);
    const results = h("div", { class: "mt-3" });

    const reportWrap = h("div", { id: "traceback-report" });

    function buildReport(query) {
      results.innerHTML = "";
      reportWrap.innerHTML = "";

      const q = norm(query);
      if (!q) {
        results.appendChild(h("div", { class: "alert alert-warning" }, ["Please enter a Batch ID or Harvest Lot ID."]));
        btnPrint.disabled = true;
        return;
      }

      // Determine whether this looks like a batch vs lot:
      // - if there is an exact harvest lot id match, treat as lot query
      // - else treat as batch query
      const directLot = findHarvestLots(store, { lotId: q });
      const mode = directLot.length ? "lot" : "batch";
      const batchId = mode === "batch" ? q : norm(pick(directLot[0], ["batchId", "batchID", "sourceBatchId", "parentBatchId"]));
      const lots = mode === "lot" ? directLot : findHarvestLots(store, { batchId });

      const lotIds = new Set(lots.map(l => norm(pick(l, ["id", "lotId", "harvestLotId"]))).filter(Boolean));
      const impactedSOs = findSalesOrders(store, lotIds);

      // Customers (best-effort)
      const customers = new Map();
      for (const so of impactedSOs) {
        const cname = norm(pick(so, ["customerName", "customer", "shipToName", "billToName"]));
        const cid = norm(pick(so, ["customerId", "customerID"]));
        const key = cid || cname || so.id || JSON.stringify(so).slice(0, 20);
        const label = cname || cid || "Unknown customer";
        customers.set(key, label);
      }

      // Header
      const meta = {
        generatedAt: StoreV2.nowISO ? StoreV2.nowISO() : new Date().toISOString(),
        query: q,
        mode,
        batchId: batchId || ""
      };

      reportWrap.appendChild(h("div", { class: "mb-3" }, [
        h("h4", { class: "mb-1" }, ["Traceback Report"]),
        h("div", { class: "text-muted" }, [
          `Generated: ${meta.generatedAt} • Query: ${meta.query} • Mode: ${meta.mode.toUpperCase()}` +
          (meta.batchId ? ` • Batch: ${meta.batchId}` : "")
        ])
      ]));

      // Summary cards
      const summaryRow = h("div", { class: "row g-2 mb-3" }, [
        h("div", { class: "col-md-4" }, [
          h("div", { class: "card" }, [
            h("div", { class: "card-body" }, [
              h("div", { class: "text-muted" }, ["Harvest Lots"]),
              h("div", { class: "fs-3 fw-semibold" }, [String(lotIds.size)])
            ])
          ])
        ]),
        h("div", { class: "col-md-4" }, [
          h("div", { class: "card" }, [
            h("div", { class: "card-body" }, [
              h("div", { class: "text-muted" }, ["Sales Orders"]),
              h("div", { class: "fs-3 fw-semibold" }, [String(impactedSOs.length)])
            ])
          ])
        ]),
        h("div", { class: "col-md-4" }, [
          h("div", { class: "card" }, [
            h("div", { class: "card-body" }, [
              h("div", { class: "text-muted" }, ["Customers"]),
              h("div", { class: "fs-3 fw-semibold" }, [String(customers.size)])
            ])
          ])
        ])
      ]);
      reportWrap.appendChild(summaryRow);

      // Lots list
      const lotList = h("div", { class: "card mb-3" }, [
        h("div", { class: "card-header fw-semibold" }, ["Harvest Lots"]),
        h("div", { class: "card-body" })
      ]);
      const lotBody = lotList.querySelector(".card-body");

      if (!lots.length) {
        lotBody.appendChild(h("div", { class: "text-muted" }, ["No harvest lots found for this query."]));
      } else {
        const ul = h("ul", { class: "mb-0" });
        for (const l of lots) {
          const id = norm(pick(l, ["id", "lotId", "harvestLotId"])) || "(no id)";
          const qty = pick(l, ["qty", "quantity", "amount"], "");
          const qa = pick(l, ["qaHold", "hold", "status"], "");
          ul.appendChild(h("li", {}, [
            `${id}` + (qty !== "" ? ` • qty: ${qty}` : "") + (qa !== "" ? ` • QA/Status: ${qa}` : "")
          ]));
        }
        lotBody.appendChild(ul);
      }
      reportWrap.appendChild(lotList);

      // Sales order list
      const soList = h("div", { class: "card mb-3" }, [
        h("div", { class: "card-header fw-semibold" }, ["Impacted Sales Orders"]),
        h("div", { class: "card-body" })
      ]);
      const soBody = soList.querySelector(".card-body");

      if (!impactedSOs.length) {
        soBody.appendChild(h("div", { class: "text-muted" }, ["No impacted sales orders found."]));
      } else {
        const ul = h("ul", { class: "mb-0" });
        for (const so of impactedSOs) {
          const soId = norm(pick(so, ["id", "soId", "orderId", "orderNumber"])) || "(no id)";
          const cust = norm(pick(so, ["customerName", "customer", "shipToName", "billToName"])) || "Unknown customer";
          const date = norm(pick(so, ["date", "shipDate", "createdAt"])) || "";
          ul.appendChild(h("li", {}, [`${soId} • ${cust}${date ? ` • ${date}` : ""}`]));
        }
        soBody.appendChild(ul);
      }
      reportWrap.appendChild(soList);

      // Customers list
      const cList = h("div", { class: "card mb-3" }, [
        h("div", { class: "card-header fw-semibold" }, ["Customers"]),
        h("div", { class: "card-body" })
      ]);
      const cBody = cList.querySelector(".card-body");

      if (!customers.size) {
        cBody.appendChild(h("div", { class: "text-muted" }, ["No customers detected from impacted orders."]));
      } else {
        const ul = h("ul", { class: "mb-0" });
        for (const name of Array.from(customers.values()).sort()) {
          ul.appendChild(h("li", {}, [name]));
        }
        cBody.appendChild(ul);
      }
      reportWrap.appendChild(cList);

      results.appendChild(reportWrap);
      btnPrint.disabled = false;
    }

    btn.addEventListener("click", () => buildReport(input.value));
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        buildReport(input.value);
      }
    });

    btnPrint.addEventListener("click", () => {
      // Print only the report block if possible
      const css = `
        @media print {
          body * { visibility: hidden !important; }
          #traceback-report, #traceback-report * { visibility: visible !important; }
          #traceback-report { position: absolute; left: 0; top: 0; width: 100%; }
        }
      `;
      const style = document.createElement("style");
      style.textContent = css;
      document.head.appendChild(style);
      window.print();
      setTimeout(() => style.remove(), 250);
    });

    root.appendChild(card);
    root.appendChild(controls);
    root.appendChild(results);
  }

  window.TracebackV2 = { renderTraceback };
})();
