// md-tracer/js/dashboard_v2.js
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

  function norm(s) {
    return (s ?? "").toString().trim();
  }

  function renderDashboard(root) {
    const store = getStore();

    const issues = Array.isArray(store.issues) ? store.issues : [];
    const sopRuns = Array.isArray(store.sopRuns) ? store.sopRuns : [];
    const harvestLots = Array.isArray(store.harvestLots) ? store.harvestLots : [];

    const openIssues = issues.filter(i => norm(i.status).toLowerCase() !== "closed");
    const criticalOpen = openIssues.filter(i => norm(i.severity).toLowerCase() === "critical");
    const draftRuns = sopRuns.filter(r => norm(r.status).toLowerCase() === "draft");

    // best-effort “QA hold”
    const qaHoldLots = harvestLots.filter(l => {
      const qaHold = l.qaHold;
      const status = norm(l.status).toLowerCase();
      return qaHold === true || status === "hold" || status === "qa hold" || status === "on hold";
    });

    const header = h("div", { class: "d-flex justify-content-between align-items-center mb-3" }, [
      h("div", {}, [
        h("h2", { class: "mb-0" }, ["Operations Dashboard"]),
        h("div", { class: "text-muted" }, ["Attention queue + KPIs (StoreV2)"])
      ]),
      h("div", { class: "d-flex gap-2" }, [
        h("a", { class: "btn btn-outline-primary", href: "traceback.html" }, ["Traceback"]),
        h("a", { class: "btn btn-outline-secondary", href: "index.html" }, ["Documents"])
      ])
    ]);

    const kpis = h("div", { class: "row g-2 mb-3" }, [
      kpi("Open Issues", openIssues.length),
      kpi("Critical Open", criticalOpen.length),
      kpi("Draft SOP Runs", draftRuns.length),
      kpi("Lots on QA Hold", qaHoldLots.length)
    ]);

    // Attention queue
    const queue = [];

    for (const i of criticalOpen) {
      queue.push({
        prio: 1,
        label: `CRITICAL Issue: ${i.title || i.id || "(untitled)"}`,
        href: "../issues/index.html",
        meta: `Status: ${i.status || "Open"}`
      });
    }

    for (const l of qaHoldLots) {
      queue.push({
        prio: 2,
        label: `Lot on hold: ${l.id || l.lotId || l.harvestLotId || "(no id)"}`,
        href: "traceback.html",
        meta: `Batch: ${l.batchId || ""}`
      });
    }

    for (const r of draftRuns.slice().reverse().slice(0, 10)) {
      queue.push({
        prio: 3,
        label: `Draft SOP Run: ${r.sopId || ""} — ${r.sopTitle || ""}`,
        href: "sop_library.html",
        meta: `Started: ${r.startedAt || ""}`
      });
    }

    for (const i of openIssues.filter(x => norm(x.severity).toLowerCase() !== "critical").slice(0, 10)) {
      queue.push({
        prio: 4,
        label: `Issue: ${i.title || i.id || "(untitled)"}`,
        href: "../issues/index.html",
        meta: `Severity: ${i.severity || ""} • Status: ${i.status || ""}`
      });
    }

    queue.sort((a, b) => a.prio - b.prio);

    const queueCard = h("div", { class: "card" }, [
      h("div", { class: "card-header fw-semibold" }, ["Attention Queue"]),
      h("div", { class: "card-body" }, [
        queue.length
          ? h("div", { class: "list-group" }, queue.map(item =>
              h("a", { class: "list-group-item list-group-item-action", href: item.href }, [
                h("div", { class: "d-flex justify-content-between" }, [
                  h("div", { class: "fw-semibold" }, [item.label]),
                  h("small", { class: "text-muted" }, [item.meta || ""])
                ])
              ])
            ))
          : h("div", { class: "text-muted" }, ["Nothing urgent right now."])
      ])
    ]);

    root.appendChild(header);
    root.appendChild(kpis);
    root.appendChild(queueCard);
  }

  function kpi(title, value) {
    return h("div", { class: "col-md-3" }, [
      h("div", { class: "card" }, [
        h("div", { class: "card-body" }, [
          h("div", { class: "text-muted" }, [title]),
          h("div", { class: "fs-2 fw-semibold" }, [String(value)])
        ])
      ])
    ]);
  }

  window.DashboardV2 = { renderDashboard };
})();
