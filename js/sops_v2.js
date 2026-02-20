// md_tracer/js/sops_v2.js
(function () {
  "use strict";

  function qs(name) {
    const u = new URL(window.location.href);
    return u.searchParams.get(name);
  }

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

  function saveStore(store) {
    StoreV2.save(store);
    // back-compat for pages that might read issues directly later
    localStorage.setItem("issues", JSON.stringify(store.issues || []));
  }

  function renderLibrary(root) {
    const store = getStore();
    const sops = store.documents.sops || [];

    const search = h("input", { class: "form-control", placeholder: "Search SOP (id/title)..." });
    const roleFilter = h("select", { class: "form-select" }, [
      h("option", { value: "" }, ["All roles"])
    ]);

    const roles = Array.from(new Set(sops.map(s => s.ownerRole).filter(Boolean))).sort();
    for (const r of roles) roleFilter.appendChild(h("option", { value: r }, [r]));

    const list = h("div", { class: "list-group mt-3" });

    const draw = () => {
      const q = (search.value || "").toLowerCase().trim();
      const role = roleFilter.value;

      list.innerHTML = "";
      const filtered = sops.filter(s => {
        const matchQ = !q || (s.id || "").toLowerCase().includes(q) || (s.title || "").toLowerCase().includes(q);
        const matchR = !role || s.ownerRole === role;
        return matchQ && matchR;
      });

      if (!filtered.length) {
        list.appendChild(h("div", { class: "text-muted p-3" }, ["No SOPs found."]));
        return;
      }

      for (const s of filtered) {
        const item = h("a", {
          class: "list-group-item list-group-item-action",
          href: `sop_runner.html?sopId=${encodeURIComponent(s.id)}`
        }, [
          h("div", { class: "d-flex w-100 justify-content-between" }, [
            h("h5", { class: "mb-1" }, [`${s.id} \u2014 ${s.title}`]),
            h("small", {}, [`v${s.version || "?"} \u2022 ${s.effectiveDate || ""}`])
          ]),
          h("small", { class: "text-muted" }, [s.ownerRole || ""])
        ]);
        list.appendChild(item);
      }
    };

    search.addEventListener("input", draw);
    roleFilter.addEventListener("change", draw);

    root.appendChild(h("div", { class: "row g-2" }, [
      h("div", { class: "col-md-8" }, [search]),
      h("div", { class: "col-md-4" }, [roleFilter])
    ]));
    root.appendChild(list);
    draw();
  }

  function renderRunner(root) {
    const sopId = qs("sopId");
    if (!sopId) {
      root.appendChild(h("div", { class: "alert alert-warning" }, ["Missing sopId in URL."]));
      return;
    }

    const store = getStore();
    const sop = (store.documents.sops || []).find(s => s.id === sopId);

    if (!sop) {
      root.appendChild(h("div", { class: "alert alert-danger" }, [`SOP not found: ${sopId}`]));
      return;
    }

    const runId = StoreV2.uid("sopRun");
    const startedAt = StoreV2.nowISO();
    const answers = {};

    const header = h("div", { class: "card mb-3" }, [
      h("div", { class: "card-body" }, [
        h("h3", { class: "card-title mb-1" }, [`${sop.id} \u2014 ${sop.title}`]),
        h("div", { class: "text-muted" }, [
          `Version ${sop.version || "?"} \u2022 Effective ${sop.effectiveDate || ""} \u2022 Owner: ${sop.ownerRole || ""}`
        ]),
        sop.purpose ? h("p", { class: "mt-2 mb-0" }, [sop.purpose]) : h("span")
      ])
    ]);

    const form = h("form", { class: "card" });
    const body = h("div", { class: "card-body" });
    const footer = h("div", { class: "card-footer d-flex gap-2 justify-content-end" });

    const stepEls = [];

    const makeStepEl = (step) => {
      const wrap = h("div", { class: "mb-3" });
      wrap.appendChild(h("label", { class: "form-label fw-semibold" }, [step.text || "Step"]));

      let input;

      if (step.type === "check") {
        input = h("input", { type: "checkbox", class: "form-check-input" });
      } else if (step.type === "number") {
        input = h("input", { type: "number", class: "form-control" });
        if (typeof step.min === "number") input.min = String(step.min);
        if (typeof step.max === "number") input.max = String(step.max);
      } else if (step.type === "select") {
        input = h("select", { class: "form-select" });
        (step.options || []).forEach(opt => input.appendChild(h("option", { value: opt }, [opt])));
      } else {
        input = h("input", { type: "text", class: "form-control" });
      }

      // store answer
      const field = step.field || `step_${step.id}`;
      const read = () => {
        if (step.type === "check") return !!input.checked;
        return (input.value ?? "").toString();
      };

      input.addEventListener("change", () => {
      answers[field] = read();
      });
      input.addEventListener("input", () => {
      answers[field] = read();
      });

      answers[field] = read();

      // bootstrap-ish layout
      if (step.type === "check") {
        const row = h("div", { class: "form-check" }, [input, h("span", { class: "ms-2" }, ["Completed"])]);
        wrap.appendChild(row);
      } else {
        wrap.appendChild(input);
      }

      return { wrap, step, field, input };
    };

    (sop.steps || []).forEach(step => {
      const sEl = makeStepEl(step);
      stepEls.push(sEl);
      body.appendChild(sEl.wrap);
    });

    const statusBox = h("div", { class: "mt-2 text-muted" }, [`Run started: ${startedAt}`]);

    const validate = () => {
      const missing = [];
      for (const sEl of stepEls) {
        if (!sEl.step.required) continue;
        const v = answers[sEl.field];
        const ok = sEl.step.type === "check" ? v === true : (v != null && String(v).trim() !== "");
        if (!ok) missing.push(sEl.step.text || sEl.field);
      }
      return missing;
    };

    const btnSaveDraft = h("button", { type: "button", class: "btn btn-outline-secondary" }, ["Save Draft"]);
    const btnComplete = h("button", { type: "button", class: "btn btn-primary" }, ["Complete SOP"]);
    const btnBack = h("a", { class: "btn btn-link", href: "sop_library.html" }, ["Back to Library"]);

    const saveRun = (status) => {
      const storeNow = getStore();
      const completedAt = status === "Completed" ? StoreV2.nowISO() : null;

      const sopRun = {
        id: runId,
        sopId: sop.id,
        sopTitle: sop.title,
        startedAt,
        completedAt,
        status,
        answers: { ...answers }
      };

      // Upsert by id
      const idx = (storeNow.sopRuns || []).findIndex(r => r && r.id === runId);
      if (idx === -1) storeNow.sopRuns.push(sopRun);
      else storeNow.sopRuns[idx] = sopRun;

      // Deviation triggers issue creation on completion
      if (status === "Completed" && sop.deviations && sop.deviations.triggerField) {
        const tf = sop.deviations.triggerField;
        const tv = sop.deviations.triggerValue;
        if (answers[tf] === tv) {
          const tpl = sop.deviations.createIssueTemplate || {};
          const issue = {
            id: StoreV2.uid("issue"),
            severity: tpl.severity || "Major",
            title: tpl.title || `Deviation from ${sop.id}`,
            summary: "",
            immediateAction: "",
            status: "Open",
            links: { sopRunId: runId, sopId: sop.id },
            createdAt: StoreV2.nowISO(),
            updatedAt: StoreV2.nowISO()
          };
          storeNow.issues.push(issue);
        }
      }

      saveStore(storeNow);
    };

    btnSaveDraft.addEventListener("click", () => {
      saveRun("Draft");
      statusBox.textContent = "Draft saved.";
    });

    btnComplete.addEventListener("click", () => {
      const missing = validate();
      if (missing.length) {
        alert("Please complete required steps:\n\n- " + missing.join("\n- "));
        return;
      }
      saveRun("Completed");
      statusBox.textContent = "Completed and saved.";
    });

    footer.appendChild(btnBack);
    footer.appendChild(btnSaveDraft);
    footer.appendChild(btnComplete);

    form.appendChild(body);
    form.appendChild(footer);

    root.appendChild(header);
    root.appendChild(form);
    root.appendChild(statusBox);
  }

  window.SOP_V2 = { renderLibrary, renderRunner };
})();
