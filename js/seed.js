// Seed data for MD Tracer (static GitHub Pages deployment)
// Seeds LocalStorage only if a key is missing, so user edits persist.
(function seedMDT() {
  const seeds = {"mdt_supplies_v1":[{"supply_item_id":18,"name":"100% Alcohol","unit_id":13,"category_id":11,"purchased_qty":14620.94,"used_qty":0.0,"written_off_qty":0.0,"qty_on_hand":14620.94,"unit_code":"g"},{"supply_item_id":41,"name":"70% Isopropyl Alcohol","unit_id":17,"category_id":11,"purchased_qty":0.0,"used_qty":0.0,"written_off_qty":0.0,"qty_on_hand":0.0,"unit_code":"l"},{"supply_item_id":27,"name":"Agar Agar Powder","unit_id":13,"category_id":7,"purchased_qty":0.0,"used_qty":0.0,"written_off_qty":0.0,"qty_on_hand":0.0,"unit_code":"g"},{"supply_item_id":40,"name":"Alkaline Detergent","unit_id":17,"category_id":11,"purchased_qty":0.0,"used_qty":0.0,"written_off_qty":0.0,"qty_on_hand":0.0,"unit_code":"l"},{"supply_item_id":38,"name":"Batch Labels – Waterproof","unit_id":13,"category_id":18,"purchased_qty":0.0,"used_qty":0.0,"written_off_qty":0.0,"qty_on_hand":0.0,"unit_code":"g"},{"supply_item_id":42,"name":"Bleach 6%","unit_id":17,"category_id":11,"purchased_qty":0.0,"used_qty":0.0,"written_off_qty":0.0,"qty_on_hand":0.0,"unit_code":"l"},{"supply_item_id":29,"name":"Dextrose / Glucose","unit_id":13,"category_id":7,"purchased_qty":0.0,"used_qty":0.0,"written_off_qty":0.0,"qty_on_hand":0.0,"unit_code":"g"},{"supply_item_id":33,"name":"Dextrose LC Grade","unit_id":13,"category_id":7,"purchased_qty":0.0,"used_qty":0.0,"written_off_qty":0.0,"qty_on_hand":0.0,"unit_code":"g"},{"supply_item_id":35,"name":"Distilled Water","unit_id":17,"category_id":7,"purchased_qty":20.0,"used_qty":0.0,"written_off_qty":4.0,"qty_on_hand":16.0,"unit_code":"l"},{"supply_item_id":25,"name":"Gypsum – CaSO₄","unit_id":13,"category_id":7,"purchased_qty":0.0,"used_qty":0.0,"written_off_qty":0.0,"qty_on_hand":0.0,"unit_code":"g"},{"supply_item_id":21,"name":"Hardwood Pellets – Maple","unit_id":13,"category_id":7,"purchased_qty":0.0,"used_qty":0.0,"written_off_qty":0.0,"qty_on_hand":0.0,"unit_code":"g"},{"supply_item_id":5,"name":"Hardwood Pellets – Oak","unit_id":14,"category_id":7,"purchased_qty":18.144,"used_qty":0.0,"written_off_qty":0.0,"qty_on_hand":18.144,"unit_code":"kg"},{"supply_item_id":32,"name":"Honey","unit_id":13,"category_id":7,"purchased_qty":0.0,"used_qty":0.0,"written_off_qty":0.0,"qty_on_hand":0.0,"unit_code":"g"},{"supply_item_id":26,"name":"Hydrated Lime – Ca(OH)₂","unit_id":13,"category_id":7,"purchased_qty":0.0,"used_qty":0.0,"written_off_qty":0.0,"qty_on_hand":0.0,"unit_code":"g"},{"supply_item_id":31,"name":"Light Malt Extract","unit_id":13,"category_id":7,"purchased_qty":1.0,"used_qty":0.0,"written_off_qty":0.283,"qty_on_hand":0.717,"unit_code":"g"},{"supply_item_id":28,"name":"Malt Extract","unit_id":13,"category_id":7,"purchased_qty":0.0,"used_qty":0.0,"written_off_qty":0.0,"qty_on_hand":0.0,"unit_code":"g"},{"supply_item_id":39,"name":"Master Cartons – Medium","unit_id":13,"category_id":18,"purchased_qty":0.0,"used_qty":0.0,"written_off_qty":0.0,"qty_on_hand":0.0,"unit_code":"g"},{"supply_item_id":3,"name":"Millet - Unhulled","unit_id":14,"category_id":7,"purchased_qty":1133.981,"used_qty":0.0,"written_off_qty":0.0,"qty_on_hand":1133.981,"unit_code":"kg"},{"supply_item_id":14,"name":"Mycelium & Cultures","unit_id":16,"category_id":21,"purchased_qty":10.0,"used_qty":0.0,"written_off_qty":0.0,"qty_on_hand":10.0,"unit_code":"ml"},{"supply_item_id":36,"name":"Normal Saline – 0.9%","unit_id":17,"category_id":7,"purchased_qty":0.0,"used_qty":0.0,"written_off_qty":0.0,"qty_on_hand":0.0,"unit_code":"l"},{"supply_item_id":19,"name":"Oats – Whole","unit_id":13,"category_id":7,"purchased_qty":0.0,"used_qty":0.0,"written_off_qty":0.0,"qty_on_hand":0.0,"unit_code":"g"},{"supply_item_id":30,"name":"Peptone","unit_id":13,"category_id":7,"purchased_qty":0.0,"used_qty":0.0,"written_off_qty":0.0,"qty_on_hand":0.0,"unit_code":"g"},{"supply_item_id":15,"name":"Popcorn – Whole","unit_id":14,"category_id":7,"purchased_qty":226.796,"used_qty":0.0,"written_off_qty":0.0,"qty_on_hand":226.796,"unit_code":"kg"},{"supply_item_id":34,"name":"RO Water","unit_id":17,"category_id":7,"purchased_qty":0.0,"used_qty":0.0,"written_off_qty":0.0,"qty_on_hand":0.0,"unit_code":"l"},{"supply_item_id":20,"name":"Rye Grain","unit_id":13,"category_id":7,"purchased_qty":0.0,"used_qty":0.0,"written_off_qty":0.0,"qty_on_hand":0.0,"unit_code":"g"},{"supply_item_id":22,"name":"Sawdust Fine","unit_id":13,"category_id":7,"purchased_qty":0.0,"used_qty":0.0,"written_off_qty":0.0,"qty_on_hand":0.0,"unit_code":"g"},{"supply_item_id":43,"name":"Sediment Filters – 1 Micron","unit_id":13,"category_id":11,"purchased_qty":0.0,"used_qty":0.0,"written_off_qty":0.0,"qty_on_hand":0.0,"unit_code":"g"},{"supply_item_id":16,"name":"Soy Hulls (Supplement)","unit_id":14,"category_id":7,"purchased_qty":907.185,"used_qty":0.0,"written_off_qty":0.0,"qty_on_hand":907.185,"unit_code":"kg"},{"supply_item_id":23,"name":"Straw – Chopped","unit_id":13,"category_id":7,"purchased_qty":0.0,"used_qty":0.0,"written_off_qty":0.0,"qty_on_hand":0.0,"unit_code":"g"},{"supply_item_id":44,"name":"TEST — Grain Dummy","unit_id":14,"category_id":7,"purchased_qty":9.072,"used_qty":0.0,"written_off_qty":0.0,"qty_on_hand":9.072,"unit_code":"kg"},{"supply_item_id":37,"name":"Unicorn Filter Bags Type B","unit_id":14,"category_id":18,"purchased_qty":0.0,"used_qty":0.0,"written_off_qty":0.0,"qty_on_hand":0.0,"unit_code":"kg"},{"supply_item_id":12,"name":"Water & Filtration","unit_id":17,"category_id":20,"purchased_qty":10000.0,"used_qty":0.0,"written_off_qty":0.0,"qty_on_hand":10000.0,"unit_code":"l"},{"supply_item_id":24,"name":"Wheat Bran","unit_id":13,"category_id":7,"purchased_qty":0.0,"used_qty":0.0,"written_off_qty":0.0,"qty_on_hand":0.0,"unit_code":"g"},{"supply_item_id":17,"name":"XL Bags for 10 LB","unit_id":14,"category_id":18,"purchased_qty":453.592,"used_qty":0.0,"written_off_qty":0.0,"qty_on_hand":453.592,"unit_code":"kg"}],"mdt_supply_categories_v1":[{"category_id":7,"name":"Ingredients & Substrate","active":true},{"category_id":11,"name":"Cleaning & Sanitation","active":true},{"category_id":18,"name":"Packaging","active":true},{"category_id":20,"name":"Water & Filtration","active":true},{"category_id":21,"name":"Cultures & Lab","active":true}],"mdt_supply_catalog_v1":[{"supply_item_id":18,"name":"100% Alcohol","category_id":11,"unit_code":"g","unit_id":13},{"supply_item_id":41,"name":"70% Isopropyl Alcohol","category_id":11,"unit_code":"l","unit_id":17},{"supply_item_id":27,"name":"Agar Agar Powder","category_id":7,"unit_code":"g","unit_id":13},{"supply_item_id":40,"name":"Alkaline Detergent","category_id":11,"unit_code":"l","unit_id":17},{"supply_item_id":38,"name":"Batch Labels – Waterproof","category_id":18,"unit_code":"g","unit_id":13},{"supply_item_id":42,"name":"Bleach 6%","category_id":11,"unit_code":"l","unit_id":17},{"supply_item_id":29,"name":"Dextrose / Glucose","category_id":7,"unit_code":"g","unit_id":13},{"supply_item_id":33,"name":"Dextrose LC Grade","category_id":7,"unit_code":"g","unit_id":13},{"supply_item_id":35,"name":"Distilled Water","category_id":7,"unit_code":"l","unit_id":17},{"supply_item_id":25,"name":"Gypsum – CaSO₄","category_id":7,"unit_code":"g","unit_id":13},{"supply_item_id":21,"name":"Hardwood Pellets – Maple","category_id":7,"unit_code":"g","unit_id":13},{"supply_item_id":5,"name":"Hardwood Pellets – Oak","category_id":7,"unit_code":"kg","unit_id":14},{"supply_item_id":32,"name":"Honey","category_id":7,"unit_code":"g","unit_id":13},{"supply_item_id":26,"name":"Hydrated Lime – Ca(OH)₂","category_id":7,"unit_code":"g","unit_id":13},{"supply_item_id":31,"name":"Light Malt Extract","category_id":7,"unit_code":"g","unit_id":13},{"supply_item_id":28,"name":"Malt Extract","category_id":7,"unit_code":"g","unit_id":13},{"supply_item_id":39,"name":"Master Cartons – Medium","category_id":18,"unit_code":"g","unit_id":13},{"supply_item_id":3,"name":"Millet - Unhulled","category_id":7,"unit_code":"kg","unit_id":14},{"supply_item_id":14,"name":"Mycelium & Cultures","category_id":21,"unit_code":"ml","unit_id":16},{"supply_item_id":36,"name":"Normal Saline – 0.9%","category_id":7,"unit_code":"l","unit_id":17},{"supply_item_id":19,"name":"Oats – Whole","category_id":7,"unit_code":"g","unit_id":13},{"supply_item_id":30,"name":"Peptone","category_id":7,"unit_code":"g","unit_id":13},{"supply_item_id":15,"name":"Popcorn – Whole","category_id":7,"unit_code":"kg","unit_id":14},{"supply_item_id":34,"name":"RO Water","category_id":7,"unit_code":"l","unit_id":17},{"supply_item_id":20,"name":"Rye Grain","category_id":7,"unit_code":"g","unit_id":13},{"supply_item_id":22,"name":"Sawdust Fine","category_id":7,"unit_code":"g","unit_id":13},{"supply_item_id":43,"name":"Sediment Filters – 1 Micron","category_id":11,"unit_code":"g","unit_id":13},{"supply_item_id":16,"name":"Soy Hulls (Supplement)","category_id":7,"unit_code":"kg","unit_id":14},{"supply_item_id":23,"name":"Straw – Chopped","category_id":7,"unit_code":"g","unit_id":13},{"supply_item_id":44,"name":"TEST — Grain Dummy","category_id":7,"unit_code":"kg","unit_id":14},{"supply_item_id":37,"name":"Unicorn Filter Bags Type B","category_id":18,"unit_code":"kg","unit_id":14},{"supply_item_id":12,"name":"Water & Filtration","category_id":20,"unit_code":"l","unit_id":17},{"supply_item_id":24,"name":"Wheat Bran","category_id":7,"unit_code":"g","unit_id":13},{"supply_item_id":17,"name":"XL Bags for 10 LB","category_id":18,"unit_code":"kg","unit_id":14}],"mdt_warehouses_v1":[{"warehouse_id":1,"name":"Main Warehouse","address":"On-site","notes":"Primary storage","active":true},{"warehouse_id":2,"name":"Cold Storage","address":"On-site","notes":"Temperature-controlled","active":true}],"mdt_locations_v1":[{"location_id":1,"warehouse_id":1,"code":"A1","description":"Dry goods rack"},{"location_id":2,"warehouse_id":1,"code":"A2","description":"Packaging shelf"},{"location_id":3,"warehouse_id":2,"code":"C1","description":"Refrigerated cabinet"}],"mdt_strains_v1":[{"strain_id":1,"name":"Lion's Mane","species":"Hericium erinaceus","notes":"Fruiting block","active":true},{"strain_id":2,"name":"Oyster – Blue","species":"Pleurotus ostreatus","notes":"Fast colonizer","active":true},{"strain_id":3,"name":"Reishi","species":"Ganoderma lucidum","notes":"Long fruiting cycle","active":true}],"mdt_spores_v1":[{"spore_id":1,"strain_id":2,"format":"Syringe","volume_ml":10,"supplier":"In-house","received":"2026-02-19","notes":"Test batch"},{"spore_id":2,"strain_id":1,"format":"Print","volume_ml":0,"supplier":"In-house","received":"2026-02-19","notes":"Backup culture"}],"mdt_document_types_v1":[{"id":"dt_sop","name":"SOP","description":"Standard operating procedure"},{"id":"dt_coa","name":"COA","description":"Certificate of analysis"},{"id":"dt_msds","name":"MSDS","description":"Material safety data sheet"}],"mdt_recipes_v1":[{"id":"r_agar","name":"Agar Plate Media","description":"Basic agar media for petri plates","inputs":[{"name":"Agar Agar Powder","qty":20,"unit":"g"},{"name":"Light Malt Extract","qty":20,"unit":"g"},{"name":"Distilled Water","qty":1,"unit":"l"}]},{"id":"r_grain_spawn","name":"Grain Spawn","description":"Sterilized grain spawn jars/bags","inputs":[{"name":"Millet - Unhulled","qty":1000,"unit":"g"},{"name":"Distilled Water","qty":700,"unit":"ml"}]},{"id":"r_bulk_substrate","name":"Bulk Substrate (HWFP + Soy)","description":"Hardwood fuel pellets + soy hulls + water","inputs":[{"name":"Hardwood Pellets – Oak","qty":2500,"unit":"g"},{"name":"Soy Hulls (Supplement)","qty":2500,"unit":"g"},{"name":"Water & Filtration","qty":4000,"unit":"ml"}]}],"mdt_requirements_v1":[{"id":"req_label","area":"Traceability","requirement":"Every batch must have a unique Batch ID and waterproof label.","severity":"must"},{"id":"req_qa","area":"QA","requirement":"Any contamination event must be logged with photo + disposition.","severity":"must"},{"id":"req_temp","area":"Incubation","requirement":"Record incubation temperature at least once per day.","severity":"should"}],"mdt_sops_v1":[{"id":"sop_prep","title":"Substrate Preparation SOP","stage":"Preparation","body":"1. Verify recipe and target hydration.
2. Weigh dry inputs.
3. Add water to target moisture.
4. Mix thoroughly.
5. Load into filter bags.
6. Label with Batch ID + date.
7. Sterilize/pasteurize per protocol."},{"id":"sop_inoc","title":"Inoculation SOP","stage":"Inoculation","body":"1. Sanitize workspace.
2. Verify sterile bag integrity.
3. Add spawn at target rate.
4. Seal and mix evenly.
5. Record spawn lot + operator.
6. Move to incubation shelves."},{"id":"sop_inc","title":"Incubation SOP","stage":"Incubation","body":"1. Set temperature and RH setpoints.
2. Check daily for growth + contamination.
3. Log observations.
4. If contamination suspected, isolate and flag for QA."},{"id":"sop_fruit","title":"Fruiting SOP","stage":"Fruiting","body":"1. Move fully colonized bags to fruiting.
2. Set RH/CO₂/Temp.
3. Provide fresh air exchanges.
4. Log pinning date and any issues."},{"id":"sop_harv","title":"Harvest SOP","stage":"Harvest","body":"1. Harvest at optimal maturity.
2. Weigh and record yield.
3. Assign harvest lot.
4. Cool promptly.
5. Clean tools and station."},{"id":"sop_clean","title":"Cleaning & Sanitation SOP","stage":"Cleaning","body":"1. Remove debris.
2. Wash with detergent.
3. Rinse.
4. Sanitize (bleach/alcohol).
5. Air dry.
6. Log completion."},{"id":"sop_qa","title":"QA & Disposition SOP","stage":"QA","body":"1. Review logs and photos.
2. Classify event severity.
3. Decide disposition (hold/rework/discard).
4. Record decision and sign off."}],"mdt_batches_v1":[{"id":"b_2026_001","name":"Batch 2026-001","strain_id":"st_1","strain_name":"Lion's Mane","start_date":"2026-02-10","status":"Incubating","notes":"Test run with HWFP+Soy substrate."},{"id":"b_2026_002","name":"Batch 2026-002","strain_id":"st_2","strain_name":"Oyster (Blue)","start_date":"2026-02-12","status":"Fruiting","notes":"Popcorn spawn + chopped straw trial."}],"mdt_stage_preparation_v1":[{"id":"prep_1","batch_id":"b_2026_001","date":"2026-02-10","recipe_id":"r_bulk_substrate","recipe_name":"Bulk Substrate (HWFP + Soy)","operator":"Admin","notes":"Hydration 60%, mixed well.","supplies_used":[{"name":"Hardwood Pellets – Oak","qty":2.5,"unit":"kg"},{"name":"Soy Hulls (Supplement)","qty":2.5,"unit":"kg"},{"name":"Water & Filtration","qty":4,"unit":"l"}]},{"id":"prep_2","batch_id":"b_2026_002","date":"2026-02-12","recipe_id":"r_bulk_substrate","recipe_name":"Bulk Substrate (HWFP + Soy)","operator":"Admin","notes":"Trial: straw supplement planned.","supplies_used":[{"name":"Water & Filtration","qty":3,"unit":"l"}]}],"mdt_stage_inoculation_v1":[{"id":"inoc_1","batch_id":"b_2026_001","date":"2026-02-11","spawn_source":"Mycelium & Cultures","spawn_rate_pct":10,"operator":"Admin","notes":"Clean inoculation; sealed bags."},{"id":"inoc_2","batch_id":"b_2026_002","date":"2026-02-13","spawn_source":"Mycelium & Cultures","spawn_rate_pct":12,"operator":"Admin","notes":"Used popcorn as grain spawn."}],"mdt_stage_incubation_v1":[{"id":"inc_1","batch_id":"b_2026_001","date":"2026-02-14","temp_c":24,"rh_pct":60,"observation":"Healthy mycelial growth","contamination":false,"notes":""},{"id":"inc_2","batch_id":"b_2026_001","date":"2026-02-16","temp_c":24,"rh_pct":60,"observation":"~60% colonized","contamination":false,"notes":""}],"mdt_stage_fruiting_v1":[{"id":"fr_1","batch_id":"b_2026_002","date":"2026-02-17","temp_c":18,"rh_pct":92,"co2_ppm":900,"observation":"Pins forming","notes":"Increase FAE slightly."}],"mdt_stage_harvest_v1":[{"id":"hv_1","batch_id":"b_2026_002","date":"2026-02-19","yield_kg":3.2,"grade":"A","notes":"First flush."}],"mdt_stage_cleaning_v1":[{"id":"cl_1","area":"Inoculation Hood","date":"2026-02-11","operator":"Admin","notes":"Wiped with 70% iso; UV 15 min."}],"mdt_stage_qa_v1":[{"id":"qa_1","batch_id":"b_2026_001","date":"2026-02-15","event":"No issues","severity":"info","disposition":"continue","notes":""}],
"mdt_users_v1":[
  {"id":"u_admin","name":"Admin","role":"admin"},
  {"id":"u_ops","name":"Operator","role":"operator"},
  {"id":"u_qa","name":"QA","role":"qa"}
],
"mdt_current_user_v1":{"user_id":"u_admin"},
"mdt_activity_v1":[],
"mdt_supply_transactions_v1":[],
"mdt_issues_v1":[
  {"id":"iss_1","batch_id":"b_2026_002","stage":"incubation","date":"2026-02-14","type":"bacteria","severity":"medium","status":"open","suspected_source":"grain","corrective_action":"Isolate; increase sanitation","notes":"Wet spot suspected in two bags."}
],
"mdt_harvest_lots_v1":[
  {"id":"lot_1","batch_id":"b_2026_002","date":"2026-02-19","flush_no":1,"wet_kg":3.2,"dry_kg":"","grade":"A","released":false,"notes":"First flush lot."}
]};

  function ensure(key, value) {
    if (localStorage.getItem(key) !== null) return;

    // Normalize supplies with unit metadata (dimension/base_unit_code)
    if (key === "mdt_supplies_v1") {
      const unitDim = (u)=>{
        u = String(u||"").toLowerCase();
        if (u==="g"||u==="kg") return "mass";
        if (u==="ml"||u==="l") return "volume";
        return "other";
      };
      const baseUnit = (u)=>{
        const d = unitDim(u);
        if (d==="mass") return "g";
        if (d==="volume") return "ml";
        return String(u||"");
      };
      value = (value||[]).map(s=>{
        const unit = s.unit_code || "";
      const baseUnit = (u)=>{u=String(u||"").toLowerCase(); if(u==="kg"||u==="g") return "g"; if(u==="l"||u==="ml") return "ml"; return String(u||"");};
      const toBase = (q,u)=>{u=String(u||"").toLowerCase(); q=Number(q||0); if(Number.isNaN(q)) return 0; if(u==="kg"||u==="l") return q*1000; return q;};
      const base = baseUnit(unit);

        return { ...s, dimension: s.dimension || unitDim(unit), base_unit_code: s.base_unit_code || baseUnit(unit) };
      });
    }

    localStorage.setItem(key, JSON.stringify(value));
  }

  Object.keys(seeds).forEach(k => ensure(k, seeds[k]));

// Seed lineage lots (culture -> LC -> spawn) and link seeded batches
if (localStorage.getItem("mdt_lineage_v1") === null) {
  const lots = [
    { id:"lin_c1", date:"2026-02-01", type:"culture", strain_id:"st_1", parent_id:"", batch_id:"", notes:"Master culture (reference)." },
    { id:"lin_lc1", date:"2026-02-05", type:"lc", strain_id:"st_1", parent_id:"lin_c1", batch_id:"", notes:"LC jar from master culture." },
    { id:"lin_g1", date:"2026-02-08", type:"grain_spawn", strain_id:"st_1", parent_id:"lin_lc1", batch_id:"b_2026_001", notes:"Grain spawn used for Batch b_2026_001." },
    { id:"lin_g2", date:"2026-02-10", type:"grain_spawn", strain_id:"st_2", parent_id:"", batch_id:"b_2026_002", notes:"Spawn run for Batch b_2026_002." }
  ];
  localStorage.setItem("mdt_lineage_v1", JSON.stringify(lots));

  // If batches exist and don't have lineage_id, attach
  try{
    const bRaw = localStorage.getItem("mdt_batches_v1")||"[]";
    const bs = JSON.parse(bRaw)||[];
    bs.forEach(b=>{
      if(!b.lineage_id){
        const lot = lots.find(l=>l.batch_id===b.id);
        if(lot) b.lineage_id = lot.id;
      }
    });
    localStorage.setItem("mdt_batches_v1", JSON.stringify(bs));
  }catch{}
}

  // Build opening supply transactions from seeded supply totals (only once)
  if (localStorage.getItem("mdt_supply_transactions_v1") === null) {
    const suppliesRaw = localStorage.getItem("mdt_supplies_v1") || "[]";
    let supplies = [];
    try { supplies = JSON.parse(suppliesRaw) || []; } catch { supplies = []; }

    const txs = [];
    const ts = new Date().toISOString();
    supplies.forEach(s => {
      const sid = s.supply_item_id;
      const unit = s.unit_code || "";
      const baseUnit = (u)=>{u=String(u||"").toLowerCase(); if(u==="kg"||u==="g") return "g"; if(u==="l"||u==="ml") return "ml"; return String(u||"");};
      const toBase = (q,u)=>{u=String(u||"").toLowerCase(); q=Number(q||0); if(Number.isNaN(q)) return 0; if(u==="kg"||u==="l") return q*1000; return q;};
      const base = baseUnit(unit);

      const purchased = Number(s.purchased_qty || 0);
      const used = Number(s.used_qty || 0);
      const written = Number(s.written_off_qty || 0);
      if (purchased) txs.push({ id: `tx_open_p_${sid}`, supply_item_id: sid, type: "purchase", qty: purchased, unit_code: unit, base_qty: toBase(purchased, unit), base_unit_code: base, date: "2026-02-01", note: "Opening balance (purchase)", created_at: ts });
      if (used) txs.push({ id: `tx_open_u_${sid}`, supply_item_id: sid, type: "use", qty: used, unit_code: unit, base_qty: toBase(used, unit), base_unit_code: base, date: "2026-02-01", note: "Opening balance (used)", created_at: ts });
      if (written) txs.push({ id: `tx_open_w_${sid}`, supply_item_id: sid, type: "writeoff", qty: written, unit_code: unit, base_qty: toBase(written, unit), base_unit_code: base, date: "2026-02-01", note: "Opening balance (write-off)", created_at: ts });
      // if none but qty_on_hand >0 and purchased=0, seed as opening adjustment
      const onhand = Number(s.qty_on_hand || 0);
      if (!purchased && onhand) txs.push({ id: `tx_open_a_${sid}`, supply_item_id: sid, type: "adjust", qty: onhand, unit_code: unit, base_qty: toBase(onhand, unit), base_unit_code: base, date: "2026-02-01", note: "Opening balance (adjustment)", created_at: ts });
    });

    localStorage.setItem("mdt_supply_transactions_v1", JSON.stringify(txs));
  }

})();
