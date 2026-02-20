// md_tracer/js/migrate_to_v2.js
(function (global) {
  "use strict";

  const FLAG = "mdt_migration_to_v2_done";

  const safeParse = (raw, fallback) => {
    if (!raw) return fallback;
    try { return JSON.parse(raw); } catch { return fallback; }
  };

  const getArr = (key) => {
    const v = safeParse(localStorage.getItem(key), []);
    return Array.isArray(v) ? v : [];
  };

  const upsertMany = (store, entity, records, keyFn) => {
    const list = store[entity];
    const byKey = new Map(list.map(r => [keyFn(r), r]));

    for (const rec of records) {
      const k = keyFn(rec);
      if (!k) continue;

      if (!byKey.has(k)) {
        list.push(rec);
        byKey.set(k, rec);
      } else {
        const existing = byKey.get(k);
        for (const [field, val] of Object.entries(rec)) {
          if (existing[field] == null && val != null) existing[field] = val;
        }
      }
    }
  };

  const migrate = () => {
    if (!global.StoreV2) {
      console.warn("StoreV2 not loaded; migration skipped");
      return;
    }

    const store = global.StoreV2.load();
    const migratedFrom = new Set(store.meta.migratedFrom || []);

    // Users
    const legacyUsers = getArr("mdt_users_v1")
      .filter(u => u && typeof u === "object")
      .map(u => ({
        id: u.id ?? u.user_id ?? `user_${(u.name || "").replace(/\s+/g, "_")}_${Math.random().toString(16).slice(2)}`,
        name: u.name ?? "",
        role: u.role ?? ""
      }))
      .filter(u => u.name || u.role);

    upsertMany(store, "users", legacyUsers, r => r.id);

    // Warehouses
    const legacyWh = getArr("mdt_warehouses_v1")
      .filter(w => w && typeof w === "object")
      .map(w => ({
        id: w.warehouse_id ?? w.id ?? `wh_${(w.name || "").replace(/\s+/g, "_")}_${Math.random().toString(16).slice(2)}`,
        name: w.name ?? "",
        location: w.address ?? w.location ?? "",
        capacity: typeof w.capacity === "number" ? w.capacity : 0
      }))
      .filter(w => w.name);

    upsertMany(store, "warehouses", legacyWh, r => r.id);

    // Categories (optional legacy key)
    const legacyCats = getArr("mdt_categories_v1");
    if (legacyCats.length) {
      const cats = legacyCats
        .filter(c => c && typeof c === "object")
        .map((c, i) => ({
          id: c.id ?? `cat_${(c.name || "").replace(/\s+/g, "_")}_${i}`,
          name: c.name ?? "",
          type: c.type ?? c.category_type ?? "Supply"
        }))
        .filter(c => c.name);

      upsertMany(store, "categories", cats, r => r.id);
    }

    migratedFrom.add("v1");
    store.meta.migratedFrom = Array.from(migratedFrom);
    store.meta.migratedAt = store.meta.migratedAt || new Date().toISOString();

    global.StoreV2.save(store);

    // Back-compat keys used by existing new pages:
    localStorage.setItem("users", JSON.stringify(store.users));
    localStorage.setItem("warehouses", JSON.stringify(store.warehouses));

    localStorage.setItem("vendors", JSON.stringify(store.vendors || []));
    localStorage.setItem("purchaseOrders", JSON.stringify(store.purchaseOrders || []));
    localStorage.setItem("salesOrders", JSON.stringify(store.salesOrders || []));

    localStorage.setItem(FLAG, "1");
  };

  global.MDT_MigrateToV2 = { migrate };
})(window);
