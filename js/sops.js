// Simple SOP manager (localStorage-backed)
(function () {
  const KEY = "mdt_sops_v1";
  let currentId = null;

  function nowIso() {
    return new Date().toISOString();
  }

  function uid() {
    return "sop_" + Math.random().toString(16).slice(2) + "_" + Date.now().toString(16);
  }

  function load() {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  }

  function saveAll(items) {
    localStorage.setItem(KEY, JSON.stringify(items));
  }

  function bySearch(items, q) {
    if (!q) return items;
    const s = q.toLowerCase();
    return items.filter(x =>
      (x.title || "").toLowerCase().includes(s) ||
      (x.stage || "").toLowerCase().includes(s) ||
      (x.body || "").toLowerCase().includes(s)
    );
  }

  function renderList() {
    const q = (document.getElementById("search").value || "").trim();
    const items = bySearch(load(), q).sort((a, b) => (b.updated_at || "").localeCompare(a.updated_at || ""));
    const list = document.getElementById("list");
    list.innerHTML = "";

    if (!items.length) {
      const empty = document.createElement("div");
      empty.className = "p-3 text-muted";
      empty.textContent = "No SOPs yet.";
      list.appendChild(empty);
      return;
    }

    for (const it of items) {
      const a = document.createElement("a");
      a.className = "list-group-item list-group-item-action sop-item";
      a.dataset.id = it.id;
      a.innerHTML = `
        <div class="d-flex justify-content-between align-items-start">
          <div>
            <div class="fw-semibold">${escapeHtml(it.title || "Untitled SOP")}</div>
            <div class="small text-muted">${escapeHtml(it.stage || "")}</div>
          </div>
          <span class="badge bg-light text-dark">${new Date(it.updated_at || it.created_at || nowIso()).toLocaleDateString()}</span>
        </div>
      `;
      list.appendChild(a);
    }
  }

  function escapeHtml(s) {
    return (s || "").replace(/[&<>"']/g, ch => ({
      "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
    }[ch]));
  }

  function clearEditor() {
    currentId = null;
    document.getElementById("title").value = "";
    document.getElementById("stage").value = "Preparation";
    document.getElementById("body").value = "";
    document.getElementById("deleteBtn").disabled = true;
    document.getElementById("meta").textContent = "";
  }

  function loadIntoEditor(id) {
    const items = load();
    const it = items.find(x => x.id === id);
    if (!it) return;

    currentId = id;
    document.getElementById("title").value = it.title || "";
    document.getElementById("stage").value = it.stage || "Preparation";
    document.getElementById("body").value = it.body || "";
    document.getElementById("deleteBtn").disabled = false;

    const created = it.created_at ? new Date(it.created_at).toLocaleString() : "-";
    const updated = it.updated_at ? new Date(it.updated_at).toLocaleString() : "-";
    document.getElementById("meta").textContent = `Created: ${created} • Updated: ${updated}`;
  }

  function upsert() {
    const title = document.getElementById("title").value.trim();
    const stage = document.getElementById("stage").value;
    const body = document.getElementById("body").value.trim();

    const items = load();
    const ts = nowIso();

    if (!currentId) {
      const it = { id: uid(), title: title || "Untitled SOP", stage, body, created_at: ts, updated_at: ts };
      items.push(it);
      saveAll(items);
      currentId = it.id;
    } else {
      const it = items.find(x => x.id === currentId);
      if (!it) return;
      it.title = title || "Untitled SOP";
      it.stage = stage;
      it.body = body;
      it.updated_at = ts;
      saveAll(items);
    }
    renderList();
    loadIntoEditor(currentId);
  }

  function removeCurrent() {
    if (!currentId) return;
    const items = load().filter(x => x.id !== currentId);
    saveAll(items);
    clearEditor();
    renderList();
  }

  document.addEventListener("DOMContentLoaded", () => {
    renderList();
    clearEditor();

    document.getElementById("search").addEventListener("input", renderList);
    document.getElementById("newBtn").addEventListener("click", clearEditor);
    document.getElementById("saveBtn").addEventListener("click", upsert);
    document.getElementById("deleteBtn").addEventListener("click", removeCurrent);

    document.getElementById("list").addEventListener("click", (e) => {
      const row = e.target.closest("[data-id]");
      if (!row) return;
      loadIntoEditor(row.dataset.id);
    });
  });
})();
