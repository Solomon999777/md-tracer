// Auto-seed categories into LocalStorage from categories.json
(async function ensureSeeded() {
  const LS_KEY = "mdt_supply_categories_v1";

  // If categories already exist, do nothing
  if (localStorage.getItem(LS_KEY)) return;

  try {
    const res = await fetch("./categories.json", { cache: "no-store" });
    if (!res.ok) return;

    const api = await res.json();

    const normalized = api.map(c => ({
      id: c.id,
      name: c.name,
      description: c.description ?? "",
      active: true
    }));

    localStorage.setItem(LS_KEY, JSON.stringify(normalized));
    console.log(`Seeded ${normalized.length} categories into ${LS_KEY}`);
  } catch (err) {
    console.error("Seeding failed:", err);
  }
})();
