// md_tracer/js/seed_v2.js
(function () {
  "use strict";

  async function fetchJSON(url) {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to fetch ${url} (${res.status})`);
    return res.json();
  }

  const isEmpty = (arr) => !Array.isArray(arr) || arr.length === 0;

  async function seed() {
    if (!window.StoreV2) return;

    const store = StoreV2.load();
    let changed = false;

    // Seed SOPs
    try {
      if (isEmpty(store.documents.sops)) {
        const sops = await fetchJSON("data/sops_seed.json");
        store.documents.sops = Array.isArray(sops) ? sops : [];
        changed = true;
      }
    } catch (e) {
      // ignore if file missing
    }

    // Seed categories from legacy categories.json (if present)
    try {
      if (isEmpty(store.categories)) {
        const cats = await fetchJSON("categories.json");
        if (Array.isArray(cats) && cats.length) {
          store.categories = cats
            .map((c, i) => ({
              id: c.id || `cat_${i}`,
              name: c.name || "",
              type: c.type || "Supply"
            }))
            .filter(c => c.name);
          changed = true;
        }
      }
    } catch (e) {
      // ignore if missing
    }

    if (changed) StoreV2.save(store);
  }

  window.MDT_SeedV2 = { seed };
})();
