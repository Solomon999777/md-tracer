import { load, save, uid } from "../js/store.js";

const KEY = "mdt_recipes_v1";

function render() {
  const tbody = document.getElementById("recipesBody");
  const items = load(KEY, []).slice().sort((a,b)=> (a.name||"").localeCompare(b.name||""));
  tbody.innerHTML = "";
  for (const r of items) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${escapeHtml(r.name || "")}</td>
      <td>${escapeHtml(r.description || "")}</td>
      <td class="text-end">
        <button class="btn btn-sm btn-outline-primary me-2" data-action="edit" data-id="${r.id}">Edit</button>
        <button class="btn btn-sm btn-outline-danger" data-action="delete" data-id="${r.id}">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  }
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

let editId = null;

function openModal(recipe=null) {
  editId = recipe?.id ?? null;
  document.getElementById("recipeName").value = recipe?.name ?? "";
  document.getElementById("recipeDescription").value = recipe?.description ?? "";
  document.getElementById("createRecipeBtn").textContent = editId ? "Save" : "Create";
  const modalEl = document.getElementById("newRecipeModal");
  const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
  modal.show();
}

function closeModal() {
  const modalEl = document.getElementById("newRecipeModal");
  const modal = bootstrap.Modal.getInstance(modalEl);
  if (modal) modal.hide();
}

document.getElementById("createRecipeBtn").addEventListener("click", () => {
  const name = document.getElementById("recipeName").value.trim();
  const description = document.getElementById("recipeDescription").value.trim();
  if (!name) { alert("Recipe name is required."); return; }
  const items = load(KEY, []);
  const now = new Date().toISOString();
  const rec = {
    id: editId || uid("recipe"),
    name,
    description,
    inputs: items.find(x=>x.id===editId)?.inputs ?? [],
    updated_at: now,
    created_at: items.find(x=>x.id===editId)?.created_at ?? now
  };
  const idx = items.findIndex(x=>x.id===rec.id);
  if (idx>=0) items[idx]=rec; else items.unshift(rec);
  save(KEY, items);
  closeModal();
  render();
});

document.getElementById("recipesBody").addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-action]");
  if (!btn) return;
  const action = btn.dataset.action;
  const id = btn.dataset.id;
  const items = load(KEY, []);
  const rec = items.find(x=>x.id===id);
  if (!rec) return;
  if (action === "edit") openModal(rec);
  if (action === "delete") {
    if (!confirm(`Delete recipe "${rec.name}"?`)) return;
    save(KEY, items.filter(x=>x.id!==id));
    render();
  }
});

document.querySelector('button[data-bs-target="#newRecipeModal"]')?.addEventListener("click", () => openModal(null));

render();
