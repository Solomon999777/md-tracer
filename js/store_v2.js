.// md_tracer/js/store_v2.js
(function (global) {
  "use strict";

  const KEY = "mdt_store_v2";

  const nowISO = () => new Date().toISOString();
  const uid = (prefix = "id") =>
    `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now()}`;

  const DEFAULT_STORE = () => ({
    version: 2,
    meta: { migratedFrom: [], migratedAt: null },
    users: [],
    warehouses: [],
    categories: [],
    catalogItems: [],
    inventoryLots: [],
    transactions: [],
    vendors: [],
    purchaseOrders: [],
    salesOrders: [],
    batches: [],
    stageLogs: [],
    harvestLots: [],
    qaEvents: [],
    issues: [],
    lineage: [],
    documents: { recipes: [], sops: [], requirements: [], docTypes: [] },
    sopRuns: [],
    audit: []
  });

  const safeParse = (raw, fallback) => {
    if (!raw) return fallback;
    try {
      return JSON.parse(raw);
    } catch {
      return fallback;
    }
  };

  const ensureShape = (obj) => {
    const d = DEFAULT_STORE();
    if (!obj || typeof obj !== "object") return d;

    for (const k of Object.keys(d)) {
      if (obj[k] == null) obj[k] = d[k];
    }

    if (!obj.documents || typeof obj.documents !== "object") obj.documents = d.documents;
    for (const k of Object.keys(d.documents)) {
      if (!Array.isArray(obj.documents[k])) obj.documents[k] = [];
    }

    const arrKeys = [
      "users","warehouses","categories","catalogItems","inventoryLots","transactions",
      "vendors","purchaseOrders","salesOrders","batches","stageLogs","harvestLots",
      "qaEvents","issues","lineage","sopRuns","audit"
    ];
    for (const k of arrKeys) if (!Array.isArray(obj[k])) obj[k] = [];

    obj.version = 2;
    return obj;
  };

  const load = () => ensureShape(safeParse(localStorage.getItem(KEY), DEFAULT_STORE()));
  const save = (store) => localStorage.setItem(KEY, JSON.stringify(ensureShape(store)));

  const auditPush = (store, entry) => {
    store.audit.push({ time: nowISO(), ...entry });
  };

  const add = (entity, record, ctx = { user: "system" }) => {
    const store = load();
    if (!Array.isArray(store[entity])) throw new Error(`Unknown entity: ${entity}`);

    const rec = { ...record };
    if (!rec.id) rec.id = uid(entity);
    rec.createdAt = rec.createdAt || nowISO();
    rec.updatedAt = nowISO();

    store[entity].push(rec);
    auditPush(store, { action: "add", entity, id: rec.id, user: ctx.user });
    save(store);
    return rec;
  };

  const update = (entity, id, patch, ctx = { user: "system" }) => {
    const store = load();
    const list = store[entity];
    if (!Array.isArray(list)) throw new Error(`Unknown entity: ${entity}`);

    const idx = list.findIndex((r) => r && r.id === id);
    if (idx === -1) throw new Error(`Not found: ${entity}/${id}`);

    list[idx] = { ...list[idx], ...patch, updatedAt: nowISO() };
    auditPush(store, { action: "update", entity, id, user: ctx.user });
    save(store);
    return list[idx];
  };

  const remove = (entity, id, ctx = { user: "system" }) => {
    const store = load();
    const list = store[entity];
    if (!Array.isArray(list)) throw new Error(`Unknown entity: ${entity}`);

    const before = list.length;
    store[entity] = list.filter((r) => r && r.id !== id);
    if (store[entity].length === before) return false;

    auditPush(store, { action: "remove", entity, id, user: ctx.user });
    save(store);
    return true;
  };

  global.StoreV2 = { KEY, load, save, add, update, remove, uid, nowISO };
})(window);
