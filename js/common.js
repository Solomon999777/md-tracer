// Common JS for MD Tracer - translations and voice commands
// This script provides multi-language support (English, Russian, Hebrew)
// and a basic speech-to-text command interface using the Web Speech API.

// Translation dictionary
const translations = {
  en: {
    "nav_scanner": "Scanner",
    "nav_search": "Search",
    "nav_backup": "Backup",
    "search_title": "Search",
    "search_placeholder": "Search batches, supplies, SOPs…",
    "search_no_results": "No results",
    "backup_title": "Backup & Restore",
    "backup_export": "Export data (JSON)",
    "backup_import": "Import data (JSON)",
    "backup_clear": "Clear local data",
    "backup_warning": "This will remove locally stored data from this browser.",
    "scanner_use_supply": "Search Supplies",
    "scanner_use_batch": "Search Batches",
    "nav_workflow": "Workflow",
    "nav_issues": "Issues",
    "nav_harvest_lots": "Harvest Lots",
    "nav_transactions": "Transactions",
    "nav_activity": "Activity Log",
    "user_label": "User",
    "role_admin": "Admin",
    "role_operator": "Operator",
    "role_qa": "QA",
    "workflow_title": "Production Workflow",
    "issues_title": "Issues & Contamination",
    "harvest_lots_title": "Harvest Lots",
    "transactions_title": "Supply Transactions",
    "activity_title": "Activity Log",
    "btn_release": "Release",
    "btn_hold": "Hold",
    "qa_required": "QA required before release.",

    "dashboard-title": "MD Tracer Dashboard",
    "warehouse-card-title": "Warehouse",
    "warehouse-card-desc": "Manage supplies, categories, catalog and more.",
    "documents-card-title": "Documents",
    "documents-card-desc": "Recipes, document types, and compliance requirements.",
    "production-card-title": "Production",
    "production-card-desc": "Preparation, inoculation, incubation and fruiting stages.",
    "procurement-card-title": "Procurement & Sales",
    "procurement-card-desc": "Manage vendors, purchase orders and sales orders.",
    "procurement-title": "Procurement & Sales",
    "vendors-card-title": "Vendors",
    "vendors-card-desc": "Manage suppliers of mushrooms and products.",
    "purchase-card-title": "Purchase Orders",
    "purchase-card-desc": "Record and track purchases from suppliers.",
    "sales-card-title": "Sales Orders",
    "sales-card-desc": "Record and manage sales to customers.",
    "vendors-header": "Vendors",
    "purchase-orders-header": "Purchase Orders",
    "sales-orders-header": "Sales Orders",
    "add-vendor": "Add Vendor",
    "add-purchase-order": "Add Purchase Order",
    "add-sales-order": "Add Sales Order",
    "vendor-name": "Vendor Name",
    "vendor-contact": "Contact",
    "vendor-organic-certified": "Organic Certified",
    "save": "Save",
    "close": "Close",
    // New module translations for analytics, warehouses, user management, organic status
    "analytics-card-title": "Analytics & Reports",
    "analytics-card-desc": "View dashboards and inventory analytics.",
    "analytics-title": "Analytics & Reports",
    "warehouses-card-title": "Warehouses",
    "warehouses-card-desc": "Manage warehouse locations and capacities.",
    "warehouses-header": "Warehouses",
    "add-warehouse": "Add Warehouse",
    "warehouse-name": "Warehouse Name",
    "warehouse-location": "Location",
    "warehouse-capacity": "Capacity",
    "user-management-card-title": "User Management",
    "user-management-card-desc": "Manage user accounts and roles.",
    "users-header": "Users",
    "add-user": "Add User",
    "user-name": "Name",
    "user-role": "Role",
    "organic-status": "Organic",
    "is-organic": "Organic",
    "is-conventional": "Conventional"
    ,
    // Integrations module
    "integrations-card-title": "Integrations",
    "integrations-card-desc": "Connect external services.",
    "scanner-card-title": "Scanner",
    "scanner-card-desc": "Scan QR and barcodes using your device camera.",
    "scanner-page-title": "Scanner | MD Tracer",
    "scanner_title": "Scan QR / Barcode",
    "scanner_subtitle": "Use your device camera to scan codes and paste results into MD Tracer.",
    "scanner_start": "Start camera",
    "scanner_stop": "Stop",
    "scanner_last": "Last scan",
    "scanner_hint": "Tip: good light helps. If permission is blocked, enable Camera access in your browser settings.",
    "back_to_dashboard": "Back to Dashboard",
    "integrations-title": "Integrations",
    "qb-section-title": "QuickBooks Integration",
    "qb-connect-status-label": "Connection Status",
    "qb-connected": "Connected",
    "qb-disconnected": "Disconnected",
    "qb-connect-button": "Connect to QuickBooks",
    "qb-client-id": "Client ID",
    "qb-client-secret": "Client Secret",
    "qb-environment": "Environment",
    "qb-save": "Save",
    "qb-cancel": "Close",
    "mapping-section-title": "Mapping Options",
    "mapping-customers": "Customers",
    "mapping-vendors": "Vendors",
    "mapping-items": "Items",
    "mapping-sales-orders": "Sales Orders",
    "mapping-purchase-orders": "Purchase Orders",
    "qb-run-sync": "Run Sync",
    "sops-card-title": "SOPs",
    "sops-card-desc": "Create and manage standard operating procedures.",
    "sops-title": "SOPs",
    "sops-subtitle": "Create and manage standard operating procedures for each stage.",
    "back-to-documents": "Back to Documents",
    "new-sop": "New",
    "sop-title": "Title",
    "sop-stage": "Stage",
    "sop-body": "Procedure",
    "delete": "Delete",
    "inventory": "Inventory"
  },
  ru: {
    "nav_scanner": "Сканер",
    "nav_search": "Поиск",
    "nav_backup": "Резервная копия",
    "search_title": "Поиск",
    "search_placeholder": "Ищите партии, расходники, SOP…",
    "search_no_results": "Ничего не найдено",
    "backup_title": "Резервное копирование и восстановление",
    "backup_export": "Экспорт данных (JSON)",
    "backup_import": "Импорт данных (JSON)",
    "backup_clear": "Очистить локальные данные",
    "backup_warning": "Это удалит данные, сохранённые в этом браузере.",
    "scanner_use_supply": "Искать расходники",
    "scanner_use_batch": "Искать партии",

    "dashboard-title": "Панель MD Tracer",
    "warehouse-card-title": "Склад",
    "warehouse-card-desc": "Управление запасами, категориями, каталогом и др.",
    "documents-card-title": "Документы",
    "documents-card-desc": "Рецепты, типы документов и требования соответствия.",
    "production-card-title": "Производство",
    "production-card-desc": "Подготовка, инокуляция, инкубация и этап плодоношения.",
    "procurement-card-title": "Закупки и продажи",
    "procurement-card-desc": "Управление поставщиками, закупками и продажами.",
    "procurement-title": "Закупки и продажи",
    "vendors-card-title": "Поставщики",
    "vendors-card-desc": "Управление поставщиками грибов и продуктов.",
    "purchase-card-title": "Закупочные заказы",
    "purchase-card-desc": "Учёт и отслеживание закупок у поставщиков.",
    "sales-card-title": "Заказы на продажу",
    "sales-card-desc": "Учёт и управление продажами клиентам.",
    "vendors-header": "Поставщики",
    "purchase-orders-header": "Закупочные заказы",
    "sales-orders-header": "Заказы на продажу",
    "add-vendor": "Добавить поставщика",
    "add-purchase-order": "Добавить заказ",
    "add-sales-order": "Добавить продажу",
    "vendor-name": "Название поставщика",
    "vendor-contact": "Контакт",
    "vendor-organic-certified": "Органическая сертификация",
    "save": "Сохранить",
    "close": "Закрыть",
    // New module translations for analytics, warehouses, user management, organic status
    "analytics-card-title": "Аналитика и отчёты",
    "analytics-card-desc": "Просмотр панелей и аналитики по запасам.",
    "analytics-title": "Аналитика и отчёты",
    "warehouses-card-title": "Склады",
    "warehouses-card-desc": "Управление местоположениями и вместимостью складов.",
    "warehouses-header": "Склады",
    "add-warehouse": "Добавить склад",
    "warehouse-name": "Название склада",
    "warehouse-location": "Местоположение",
    "warehouse-capacity": "Вместимость",
    "user-management-card-title": "Управление пользователями",
    "user-management-card-desc": "Управление учетными записями и ролями.",
    "users-header": "Пользователи",
    "add-user": "Добавить пользователя",
    "user-name": "Имя",
    "user-role": "Роль",
    "organic-status": "Органический",
    "is-organic": "Органический",
    "is-conventional": "Неорганический"
    ,
    // Integrations module
    "integrations-card-title": "Интеграции",
    "integrations-card-desc": "Подключение внешних сервисов.",
    "scanner-card-title": "Сканер",
    "scanner-card-desc": "Сканируйте QR и штрихкоды с помощью камеры устройства.",
    "scanner-page-title": "Сканер | MD Tracer",
    "scanner_title": "Сканирование QR / штрихкода",
    "scanner_subtitle": "Используйте камеру устройства для сканирования и вставки результатов в MD Tracer.",
    "scanner_start": "Включить камеру",
    "scanner_stop": "Остановить",
    "scanner_last": "Последнее сканирование",
    "scanner_hint": "Совет: хорошее освещение помогает. Если доступ запрещён, разрешите камеру в настройках браузера.",
    "back_to_dashboard": "Назад на панель",
    "integrations-title": "Интеграции",
    "qb-section-title": "Интеграция QuickBooks",
    "qb-connect-status-label": "Статус соединения",
    "qb-connected": "Подключено",
    "qb-disconnected": "Не подключено",
    "qb-connect-button": "Подключить QuickBooks",
    "qb-client-id": "ID клиента",
    "qb-client-secret": "Секрет клиента",
    "qb-environment": "Окружение",
    "qb-save": "Сохранить",
    "qb-cancel": "Закрыть",
    "mapping-section-title": "Параметры сопоставления",
    "mapping-customers": "Клиенты",
    "mapping-vendors": "Поставщики",
    "mapping-items": "Товары",
    "mapping-sales-orders": "Заказы на продажу",
    "mapping-purchase-orders": "Закупочные заказы",
    "qb-run-sync": "Запустить синхронизацию",
    "sops-card-title": "СОП",
    "sops-card-desc": "Создавайте и управляйте стандартными процедурами.",
    "sops-title": "СОП",
    "sops-subtitle": "Создавайте и управляйте стандартными процедурами для каждого этапа.",
    "back-to-documents": "Назад к документам",
    "new-sop": "Новый",
    "sop-title": "Название",
    "sop-stage": "Этап",
    "sop-body": "Процедура",
    "delete": "Удалить",
    "inventory": "Запасы"
  },
  he: {
    "nav_scanner": "סורק",
    "nav_search": "חיפוש",
    "nav_backup": "גיבוי",
    "search_title": "חיפוש",
    "search_placeholder": "חפש אצוות, מלאי, נהלים…",
    "search_no_results": "לא נמצאו תוצאות",
    "backup_title": "גיבוי ושחזור",
    "backup_export": "ייצוא נתונים (JSON)",
    "backup_import": "ייבוא נתונים (JSON)",
    "backup_clear": "נקה נתונים מקומיים",
    "backup_warning": "זה ימחק נתונים שנשמרו בדפדפן הזה.",
    "scanner_use_supply": "חפש מלאי",
    "scanner_use_batch": "חפש אצוות",

    "dashboard-title": "לוח בקרה MD Tracer",
    "warehouse-card-title": "מחסן",
    "warehouse-card-desc": "ניהול מלאי, קטגוריות, קטלוג ועוד.",
    "documents-card-title": "מסמכים",
    "documents-card-desc": "מתכונים, סוגי מסמכים ודרישות תאימות.",
    "production-card-title": "ייצור",
    "production-card-desc": "הכנה, חיסון, דגירה ושלבי פריחה.",
    "procurement-card-title": "רכש ומכירות",
    "procurement-card-desc": "ניהול ספקים, הזמנות רכש והזמנות מכירה.",
    "procurement-title": "רכש ומכירות",
    "vendors-card-title": "ספקים",
    "vendors-card-desc": "ניהול ספקי פטריות ומוצרים.",
    "purchase-card-title": "הזמנות רכש",
    "purchase-card-desc": "רישום ומעקב אחר רכישות מספקים.",
    "sales-card-title": "הזמנות מכירה",
    "sales-card-desc": "רישום וניהול מכירות ללקוחות.",
    "vendors-header": "ספקים",
    "purchase-orders-header": "הזמנות רכש",
    "sales-orders-header": "הזמנות מכירה",
    "add-vendor": "הוסף ספק",
    "add-purchase-order": "הוסף הזמנת רכש",
    "add-sales-order": "הוסף הזמנת מכירה",
    "vendor-name": "שם ספק",
    "vendor-contact": "איש קשר",
    "vendor-organic-certified": "תעודת אורגני",
    "save": "שמור",
    "close": "סגור",
    // New module translations for analytics, warehouses, user management, organic status
    "analytics-card-title": "ניתוח ודוחות",
    "analytics-card-desc": "צפייה בלוחות מחוונים וניתוח מלאי.",
    "analytics-title": "ניתוח ודוחות",
    "warehouses-card-title": "מחסנים",
    "warehouses-card-desc": "ניהול מיקומים וקיבולת של מחסנים.",
    "warehouses-header": "מחסנים",
    "add-warehouse": "הוסף מחסן",
    "warehouse-name": "שם מחסן",
    "warehouse-location": "מיקום",
    "warehouse-capacity": "קיבולת",
    "user-management-card-title": "ניהול משתמשים",
    "user-management-card-desc": "ניהול חשבונות משתמש ותפקידים.",
    "users-header": "משתמשים",
    "add-user": "הוסף משתמש",
    "user-name": "שם",
    "user-role": "תפקיד",
    "organic-status": "אורגני",
    "is-organic": "אורגני",
    "is-conventional": "קונבנציונלי"
    ,
    // Integrations module
    "integrations-card-title": "אינטגרציות",
    "integrations-card-desc": "חיבור שירותים חיצוניים.",
    "scanner-card-title": "סורק",
    "scanner-card-desc": "סרקו קודי QR וברקודים באמצעות מצלמת המכשיר.",
    "scanner-page-title": "סורק | MD Tracer",
    "scanner_title": "סריקת QR / ברקוד",
    "scanner_subtitle": "השתמשו במצלמת המכשיר כדי לסרוק ולהדביק תוצאות ל‑MD Tracer.",
    "scanner_start": "הפעל מצלמה",
    "scanner_stop": "עצור",
    "scanner_last": "סריקה אחרונה",
    "scanner_hint": "טיפ: תאורה טובה עוזרת. אם ההרשאה חסומה, אפשרו גישה למצלמה בהגדרות הדפדפן.",
    "back_to_dashboard": "חזרה ללוח הבקרה",
    "integrations-title": "אינטגרציות",
    "qb-section-title": "אינטגרציית QuickBooks",
    "qb-connect-status-label": "סטטוס חיבור",
    "qb-connected": "מחובר",
    "qb-disconnected": "מנותק",
    "qb-connect-button": "התחבר ל-QuickBooks",
    "qb-client-id": "מזהה לקוח",
    "qb-client-secret": "סוד הלקוח",
    "qb-environment": "סביבה",
    "qb-save": "שמור",
    "qb-cancel": "סגור",
    "mapping-section-title": "אפשרויות מיפוי",
    "mapping-customers": "לקוחות",
    "mapping-vendors": "ספקים",
    "mapping-items": "פריטים",
    "mapping-sales-orders": "הזמנות מכירה",
    "mapping-purchase-orders": "הזמנות רכש",
    "qb-run-sync": "הפעל סנכרון",
    "sops-card-title": "נהלי עבודה (SOP)",
    "sops-card-desc": "יצירה וניהול נהלי עבודה סטנדרטיים.",
    "sops-title": "נהלי עבודה (SOP)",
    "sops-subtitle": "יצירה וניהול נהלי עבודה לכל שלב.",
    "back-to-documents": "חזרה למסמכים",
    "new-sop": "חדש",
    "sop-title": "כותרת",
    "sop-stage": "שלב",
    "sop-body": "נוהל",
    "delete": "מחיקה",
    "inventory": "מלאי"
  }
};


// Phrase-based translations (fallback for pages that don't yet use data-i18n-key)
// Keys are the original English UI strings as they appear in the HTML.
const phraseTranslations = {
  ru: {
    "Back": "Назад",
    "Close": "Закрыть",
    "Cancel": "Отмена",
    "Save": "Сохранить",
    "Create": "Создать",
    "Edit": "Редактировать",
    "Delete": "Удалить",
    "Apply": "Применить",
    "Search": "Поиск",
    "All": "Все",
    "Actions": "Действия",
    "Status": "Статус",
    "Active": "Активно",
    "Completed": "Завершено",
    "Pending": "В ожидании",
    "Approved": "Одобрено",
    "Date": "Дата",
    "Name": "Название",
    "Description": "Описание",
    "Category": "Категория",
    "Quantity": "Количество",
    "Qty on hand": "В наличии",
    "Unit": "Ед.",
    "Supplies": "Материалы",
    "Warehouse": "Склад",
    "Warehouses": "Склады",
    "Locations": "Локации",
    "Strains": "Штаммы",
    "Spores": "Споры",
    "Documents": "Документы",
    "SOPs": "СОП",
    "Recipes": "Рецепты",
    "Document Types": "Типы документов",
    "Requirements Matrix": "Матрица требований",
    "Production": "Производство",
    "Batches": "Партии",
    "Preparation": "Подготовка",
    "Inoculation": "Инокуляция",
    "Incubation": "Инкубация",
    "Fruiting": "Плодоношение",
    "Harvest": "Сбор",
    "Cleaning": "Очистка",
    "QA": "Контроль качества",
    "Procurement & Sales": "Закупки и продажи",
    "Vendors": "Поставщики",
    "Purchase Orders": "Заказы на закупку",
    "Sales Orders": "Заказы на продажу",
    "Customers": "Клиенты",
    "Analytics & Reports": "Аналитика и отчёты",
    "Integrations": "Интеграции",
    "Users": "Пользователи",
    "Admin": "Админ",
    "Back to Dashboard": "Назад к панели",
    "Back to Warehouse": "Назад к складу",
    "Back to Documents": "Назад к документам",
    "Back to Production": "Назад к производству",
    "Back to Supplies": "Назад к материалам"
  },
  he: {
    "Back": "חזרה",
    "Close": "סגור",
    "Cancel": "ביטול",
    "Save": "שמור",
    "Create": "צור",
    "Edit": "ערוך",
    "Delete": "מחק",
    "Apply": "החל",
    "Search": "חיפוש",
    "All": "הכל",
    "Actions": "פעולות",
    "Status": "סטטוס",
    "Active": "פעיל",
    "Completed": "הושלם",
    "Pending": "ממתין",
    "Approved": "אושר",
    "Date": "תאריך",
    "Name": "שם",
    "Description": "תיאור",
    "Category": "קטגוריה",
    "Quantity": "כמות",
    "Qty on hand": "במלאי",
    "Unit": "יחידה",
    "Supplies": "חומרי גלם",
    "Warehouse": "מחסן",
    "Warehouses": "מחסנים",
    "Locations": "מיקומים",
    "Strains": "זנים",
    "Spores": "נבגים",
    "Documents": "מסמכים",
    "SOPs": "נהלי עבודה",
    "Recipes": "מתכונים",
    "Document Types": "סוגי מסמכים",
    "Requirements Matrix": "מטריצת דרישות",
    "Production": "ייצור",
    "Batches": "אצוות",
    "Preparation": "הכנה",
    "Inoculation": "חיסון",
    "Incubation": "אינקובציה",
    "Fruiting": "פרי",
    "Harvest": "קציר",
    "Cleaning": "ניקיון",
    "QA": "אבטחת איכות",
    "Procurement & Sales": "רכש ומכירות",
    "Vendors": "ספקים",
    "Purchase Orders": "הזמנות רכש",
    "Sales Orders": "הזמנות מכירה",
    "Customers": "לקוחות",
    "Analytics & Reports": "אנליטיקה ודוחות",
    "Integrations": "אינטגרציות",
    "Users": "משתמשים",
    "Admin": "ניהול",
    "Back to Dashboard": "חזרה ללוח הבקרה",
    "Back to Warehouse": "חזרה למחסן",
    "Back to Documents": "חזרה למסמכים",
    "Back to Production": "חזרה לייצור",
    "Back to Supplies": "חזרה לחומרי גלם"
  }
};

function translateByPhrase(text, lang) {
  const map = phraseTranslations[lang];
  if (!map) return null;
  if (map[text]) return map[text];

  // Patterns: "Back to X"
  const backMatch = text.match(/^Back to\s+(.+)$/);
  if (backMatch) {
    const tail = backMatch[1].trim();
    const tailTr = map[tail] || tail;
    if (lang === 'ru') return `Назад к ${tailTr.toLowerCase() === tailTr ? tailTr : tailTr}`;
    if (lang === 'he') return `חזרה ל${tailTr}`;
  }

  // Patterns: "+ New X" or "+ Create X"
  const plusMatch = text.match(/^\+\s*(New|Create)\s+(.+)$/);
  if (plusMatch) {
    const verb = plusMatch[1];
    const tail = plusMatch[2].trim();
    const verbTr = map[verb] || (lang === 'ru' ? (verb === 'New' ? 'Новый' : 'Создать') : (verb === 'New' ? 'חדש' : 'צור'));
    const tailTr = map[tail] || tail;
    return `+ ${verbTr} ${tailTr}`;
  }

  return null;
}


// Set language and apply translations
function setLanguage(lang) {
  localStorage.setItem('lang', lang);
  applyTranslations();
  if (recognition) {
    recognition.lang = (lang === 'ru' ? 'ru-RU' : lang === 'he' ? 'he-IL' : 'en-US');
  }
}

function applyTranslations() {
  const lang = localStorage.getItem('lang') || 'en';

  // Update html lang + direction
  document.documentElement.lang = lang;
  document.documentElement.dir = (lang === 'he') ? 'rtl' : 'ltr';

  // Key-based translations
  document.querySelectorAll('[data-i18n-key]').forEach(el => {
    const key = el.dataset.i18nKey;
    let translation = translations[lang] && translations[lang][key];
    if (!translation) translation = (translations['en'] && translations['en'][key]) || el.textContent;

    const tag = el.tagName.toLowerCase();
    if (tag === 'input' || tag === 'textarea') {
      el.placeholder = translation;
    } else {
      el.textContent = translation;
    }
  });

  // Attribute translations (optional): data-i18n-placeholder / -title / -aria
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.dataset.i18nPlaceholder;
    const tr = (translations[lang] && translations[lang][key]) || (translations['en'] && translations['en'][key]) || el.placeholder;
    el.placeholder = tr;
  });
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    const key = el.dataset.i18nTitle;
    const tr = (translations[lang] && translations[lang][key]) || (translations['en'] && translations['en'][key]) || el.title;
    el.title = tr;
  });
  document.querySelectorAll('[data-i18n-aria]').forEach(el => {
    const key = el.dataset.i18nAria;
    const tr = (translations[lang] && translations[lang][key]) || (translations['en'] && translations['en'][key]) || el.getAttribute('aria-label');
    if (tr) el.setAttribute('aria-label', tr);
  });

  // Phrase-based fallback: translate common UI text even if a page hasn't been tagged yet.
  if (lang !== 'en') {
    const candidates = document.querySelectorAll('h1,h2,h3,th,label,button,a,option,span.badge,span,small');
    candidates.forEach(el => {
      // Skip elements that are explicitly key-translated or contain complex children
      if (el.hasAttribute('data-i18n-key')) return;
      if (el.children && el.children.length > 0 && el.tagName.toLowerCase() !== 'button') return;

      const raw = (el.dataset.i18nOriginal != null) ? el.dataset.i18nOriginal : el.textContent;
      const text = (raw || '').trim();
      if (!text) return;

      // Store original once so switching back to English restores perfectly
      if (el.dataset.i18nOriginal == null) el.dataset.i18nOriginal = text;

      const tr = translateByPhrase(text, lang);
      if (tr) el.textContent = tr;
    });
  } else {
    // Restore originals when switching back to English
    document.querySelectorAll('[data-i18n-original]').forEach(el => {
      el.textContent = el.dataset.i18nOriginal;
      delete el.dataset.i18nOriginal;
    });
  }

  const selector = document.getElementById('langSelector');
  if (selector) selector.value = lang;
}

function setupLanguageSelector() {
  const selector = document.getElementById('langSelector');
  if (!selector) return;
  const lang = localStorage.getItem('lang') || 'en';
  selector.value = lang;
  selector.addEventListener('change', (e) => {
    setLanguage(e.target.value);
  });
}

// Speech recognition
let recognition;
function initVoiceCommands() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    console.warn('Speech recognition API not supported');
    return;
  }
  recognition = new SpeechRecognition();
  const lang = localStorage.getItem('lang') || 'en';
  recognition.lang = (lang === 'ru' ? 'ru-RU' : lang === 'he' ? 'he-IL' : 'en-US');
  recognition.onresult = function(event) {
    const command = event.results[0][0].transcript;
    handleCommand(command);
  };
  recognition.onerror = function(event) {
    console.error('Speech recognition error', event);
  };
}

function startVoiceCommand() {
  if (!recognition) initVoiceCommands();
  if (recognition) recognition.start();
}


function handleCommand(command) {
  const cmd = (command || '').toLowerCase().trim();
  const basePath = (() => {
    const parts = window.location.pathname.split('/').filter(Boolean);
    // If deployed under a subpath (e.g., GitHub Pages /repo/...), keep the first segment as base.
    if (parts.length >= 2) return '/' + parts[0] + '/';
    return '/';
  })();

  const routes = [
    // English
    { re: /(dashboard|home)/, href: 'index.html' },
    { re: /warehouse|stock|inventory/, href: 'warehouse/index.html' },
    { re: /supplies?|supply inventory/, href: 'warehouse/supplies/inventory.html' },
    { re: /(scanner|scan|qr|barcode|camera)/, href: 'scanner.html' },
    { re: /documents?|recipes?|requirements?/, href: 'documents/index.html' },
    { re: /sop(s)?|procedure(s)?/, href: 'documents/sops.html' },
    { re: /\bproduction\b|\binoculation\b|\bincubation\b|\bfruiting\b|\bpreparation\b/, href: 'production/index.html' },
    { re: /\blineage\b|\bculture\b|\bspawn lot\b|\blot(s)?\b/, href: 'production/lineage.html' },
    { re: /procurement|sales|vendors?|purchase/, href: 'procurement/index.html' },
    { re: /analytics?|reports?/, href: 'analytics/index.html' },
    { re: /integrations?|quickbooks|sync/, href: 'integration/index.html' },
    { re: /users?|user management|admin/, href: 'admin/users.html' },

    // Russian
    { re: /(главная|панель|домой)/, href: 'index.html' },
    { re: /(склад|запас(ы)?|инвентар(ь|изация))/, href: 'warehouse/index.html' },
    { re: /(сканер|сканировать|скан|qr|штрихкод|камера)/, href: 'scanner.html' },
    { re: /(документ(ы)?|рецепт(ы)?|требовани(я|е))/, href: 'documents/index.html' },
    { re: /(соп|процедур(а|ы)|инструкци(я|и))/, href: 'documents/sops.html' },
    { re: /(производств(о|а)|инокуляц(ия|ии)|инкубац(ия|ии)|плодонош(ение|ения)|подготовк(а|и))/, href: 'production/index.html' },
    { re: /(закупк(и|а)|продаж(и|а)|поставщик(и|а)|покупк(и|а))/, href: 'procurement/index.html' },
    { re: /(аналитик(а|и)|отчет(ы)?|отчёт(ы)?)/, href: 'analytics/index.html' },
    { re: /(интеграц(ия|ии)|квикбукс|quickbooks|синхрон(изация|изировать)|синк)/, href: 'integration/index.html' },
    { re: /(пользовател(и|ь)|управление пользователями|админ)/, href: 'admin/users.html' },

    // Hebrew (basic keywords)
    { re: /(בית|דאשבורד|דשבורד|ראשי)/, href: 'index.html' },
    { re: /(מחסן|מלאי|סטוק|אינבנטורי)/, href: 'warehouse/index.html' },
    { re: /(סורק|סריקה|לסרוק|qr|ברקוד|מצלמה)/, href: 'scanner.html' },
    { re: /(מסמכים|מתכונים|דרישות)/, href: 'documents/index.html' },
    { re: /(נוהל|נהלים|sop)/, href: 'documents/sops.html' },
    { re: /(ייצור|הכנה|אינוקולציה|אינקובציה|פרי|פריחה|פרויטינג)/, href: 'production/index.html' },
    { re: /(רכש|מכירות|ספקים|הזמנה)/, href: 'procurement/index.html' },
    { re: /(אנליטיקה|דוחות|דו"חות)/, href: 'analytics/index.html' },
    { re: /(אינטגרציה|אינטגרציות|קויקבוקס|סנכרון)/, href: 'integration/index.html' },
    { re: /(משתמשים|ניהול משתמשים|אדמין)/, href: 'admin/users.html' },
  ];

  const match = routes.find(r => r.re.test(cmd));
  if (match) {
    window.location.href = basePath + match.href;
    return;
  }

  alert('Recognized command: ' + command + '\nTry: "warehouse", "documents", "production", "procurement", "analytics", "integrations", or "users".');
}


// --- UX utilities: Toasts, Global Search, Backup link, Scanner integration helpers ---

function ensureToastContainer(){
  let c=document.getElementById('mdtToastContainer');
  if(c) return c;
  c=document.createElement('div');
  c.id='mdtToastContainer';
  c.className='toast-container position-fixed top-0 end-0 p-3';
  c.style.zIndex='1100';
  document.body.appendChild(c);
  return c;
}

function showToast(message, type='info', delay=2800){
  // type: info|success|warning|danger
  ensureToastContainer();
  const id='t_'+Math.random().toString(16).slice(2);
  const bg = ({info:'text-bg-primary',success:'text-bg-success',warning:'text-bg-warning',danger:'text-bg-danger'})[type] || 'text-bg-primary';
  const div=document.createElement('div');
  div.className=`toast align-items-center ${bg} border-0`;
  div.id=id;
  div.role='alert';
  div.ariaLive='assertive';
  div.ariaAtomic='true';
  div.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">${String(message).replace(/</g,'&lt;')}</div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>`;
  document.getElementById('mdtToastContainer').appendChild(div);
  // bootstrap is loaded on most pages; if not, fallback to auto-remove
  try{
    const t = new bootstrap.Toast(div, { delay });
    div.addEventListener('hidden.bs.toast', ()=>div.remove());
    t.show();
  }catch(e){
    setTimeout(()=>div.remove(), delay);
  }
}

function headerEnhancements(){
  const langSel=document.getElementById('langSelector');
  if(!langSel) return;
  const bar = langSel.closest('.d-flex') || langSel.parentElement;
  if(!bar) return;

  // Avoid double injection
  if(document.getElementById('mdtSearchBtn')) return;

  const searchBtn=document.createElement('button');
  searchBtn.id='mdtSearchBtn';
  searchBtn.className='btn btn-outline-secondary btn-sm me-2';
  searchBtn.type='button';
  searchBtn.textContent='🔎';
  searchBtn.title='Search (Ctrl+K)';
  searchBtn.addEventListener('click', openGlobalSearch);


  // User menu (simple local role switching for this static app)
  const userWrap=document.createElement('div');
  userWrap.className='dropdown me-2';

  const usersRaw = localStorage.getItem('mdt_users_v1') || '[]';
  const curRaw = localStorage.getItem('mdt_current_user_v1') || '{"user_id":"u_admin"}';
  let users=[], cur={user_id:"u_admin"};
  try{ users=JSON.parse(usersRaw)||[]; }catch(e){ users=[]; }
  try{ cur=JSON.parse(curRaw)||cur; }catch(e){}

  const curUser = users.find(u=>u.id===cur.user_id) || users[0] || {id:'u_admin',name:'Admin',role:'admin'};

  const btn=document.createElement('button');
  btn.className='btn btn-outline-secondary btn-sm dropdown-toggle';
  btn.type='button';
  btn.setAttribute('data-bs-toggle','dropdown');
  btn.setAttribute('aria-expanded','false');
  btn.id='mdtUserBtn';
  btn.title='User';
  btn.textContent = `👤 ${curUser.name} (${curUser.role})`;

  const menu=document.createElement('ul');
  menu.className='dropdown-menu dropdown-menu-end';
  menu.style.minWidth='220px';

  users.forEach(u=>{
    const li=document.createElement('li');
    const a=document.createElement('button');
    a.type='button';
    a.className='dropdown-item';
    a.textContent = `${u.name} — ${u.role}`;
    a.addEventListener('click', ()=>{
      localStorage.setItem('mdt_current_user_v1', JSON.stringify({user_id:u.id}));
      location.reload();
    });
    li.appendChild(a);
    menu.appendChild(li);
  });

  const div=document.createElement('li');
  div.innerHTML = `<hr class="dropdown-divider">`;
  menu.appendChild(div);

  const actLi=document.createElement('li');
  actLi.innerHTML = `<a class="dropdown-item" href="${basePath}admin/activity.html">📜 Activity</a>`;
  menu.appendChild(actLi);

  userWrap.appendChild(btn);
  userWrap.appendChild(menu);

  const backupLink=document.createElement('a');
  backupLink.href = basePath + 'admin/backup.html';
  backupLink.className='btn btn-outline-secondary btn-sm me-2';
  backupLink.id='mdtBackupBtn';
  backupLink.textContent='💾';
  backupLink.title='Backup';

  // Insert before selector
  bar.insertBefore(backupLink, langSel);
  bar.insertBefore(userWrap, backupLink);

  bar.insertBefore(searchBtn, backupLink);

  // Keyboard shortcut Ctrl+K / Cmd+K
  window.addEventListener('keydown', (e)=>{
    if((e.ctrlKey||e.metaKey) && (e.key==='k' || e.key==='K')){
      e.preventDefault();
      openGlobalSearch();
    }
  });
}

function ensureSearchModal(){
  let m=document.getElementById('mdtSearchModal');
  if(m) return m;
  m=document.createElement('div');
  m.className='modal fade';
  m.id='mdtSearchModal';
  m.tabIndex=-1;
  m.innerHTML = `
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" data-i18n-key="search_title">Search</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <input id="mdtSearchInput" class="form-control" placeholder="" autocomplete="off"/>
        <div class="list-group mt-3" id="mdtSearchResults"></div>
        <div class="text-muted small mt-2">Tip: scan a QR/barcode then press Ctrl+K to search.</div>
      </div>
    </div>
  </div>`;
  document.body.appendChild(m);

  const inp=m.querySelector('#mdtSearchInput');
  inp.addEventListener('input', ()=>renderGlobalSearchResults(inp.value));
  inp.addEventListener('keydown', (e)=>{
    if(e.key==='Enter'){
      const first=m.querySelector('#mdtSearchResults a');
      if(first) first.click();
    }
  });

  return m;
}

function safeLoad(key){
  try{
    const raw=localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  }catch{ return []; }
}

function buildSearchIndex(){
  const out=[];
  const supplies=safeLoad('mdt_supplies_v1');
  for(const s of supplies){
    out.push({type:'Supply', label:`${s.name}`, sub:`ID ${s.supply_item_id}`, href: basePath+'warehouse/supplies/inventory.html?q='+encodeURIComponent(s.name)});
  }
  const batches=safeLoad('mdt_batches_v1');
  for(const b of batches){
    out.push({type:'Batch', label:`${b.name}`, sub:`${b.id} · ${b.status||''}`, href: basePath+'production/batches.html?q='+encodeURIComponent(b.id)});
  }
  const sops=safeLoad('mdt_sops_v1');
  for(const s of sops){
    out.push({type:'SOP', label:`${s.title||s.name||'SOP'}`, sub:`${s.stage||''}`, href: basePath+'documents/sops.html?q='+encodeURIComponent(s.title||'')});
  }
  const recipes=safeLoad('mdt_recipes_v1');
  for(const r of recipes){
    out.push({type:'Recipe', label:`${r.name||'Recipe'}`, sub:`${r.category||''}`, href: basePath+'documents/recipes.html?q='+encodeURIComponent(r.name||'')});
  }
  const issues=safeLoad('mdt_issues_v1');
  for(const i of issues){
    out.push({type:'Issue', label:`${i.type||'issue'} · ${i.batch_id||''}`, sub:`${i.severity||''} · ${i.status||''}`, href: basePath+'production/issues.html?q='+encodeURIComponent(i.batch_id||'')});
  }
  const lots=safeLoad('mdt_harvest_lots_v1');
  for(const l of lots){
    out.push({type:'Lot', label:`${l.id}`, sub:`${l.batch_id||''} · flush ${l.flush_no||''}`, href: basePath+'production/harvest_lots.html?q='+encodeURIComponent(l.id)});
  }


const harvest=safeLoad('mdt_harvest_lots_v1');
for(const h of harvest){
  out.push({type:'Harvest', label:`${h.id} · ${h.batch_id||''}`, sub:`${h.status||''}`, href: basePath+'production/harvest_lots.html?q='+encodeURIComponent(h.id||'')});
}
const lineage=safeLoad('mdt_lineage_v1');
for(const l of lineage){
  out.push({type:'Lineage', label:`${l.type} · ${l.id}`, sub:`${l.strain_id||''} · ${l.parent_id||''}`, href: basePath+'production/lineage.html?q='+encodeURIComponent(l.id||'')});
}
  const strains=safeLoad('mdt_strains_v1');
  for(const st of strains){
    out.push({type:'Strain', label:`${st.name}`, sub:`${st.species||''}`, href: basePath+'warehouse/strains.html?q='+encodeURIComponent(st.name)});
  }
  return out;
}

let _searchIndex=null;
function renderGlobalSearchResults(query){
  const list=document.getElementById('mdtSearchResults');
  if(!list) return;
  const q=(query||'').trim().toLowerCase();
  if(!_searchIndex) _searchIndex=buildSearchIndex();
  const results = !q ? _searchIndex.slice(0,12) : _searchIndex.filter(x => (x.label||'').toLowerCase().includes(q) || (x.sub||'').toLowerCase().includes(q) || (x.type||'').toLowerCase().includes(q)).slice(0,30);
  list.innerHTML='';
  if(!results.length){
    const div=document.createElement('div');
    div.className='text-muted';
    div.setAttribute('data-i18n-key','search_no_results');
    div.textContent='No results';
    list.appendChild(div);
    applyTranslations();
    return;
  }
  for(const r of results){
    const a=document.createElement('a');
    a.className='list-group-item list-group-item-action';
    a.href=r.href;
    a.innerHTML = `<div class="d-flex justify-content-between">
      <div>
        <div class="fw-semibold">${r.label.replace(/</g,'&lt;')}</div>
        <div class="small text-muted">${r.type} · ${String(r.sub||'').replace(/</g,'&lt;')}</div>
      </div>
      <div class="text-muted">↩</div>
    </div>`;
    list.appendChild(a);
  }
}

async function ensureBootstrap(){
  if(window.bootstrap) return;
  await new Promise((resolve,reject)=>{
    const s=document.createElement('script');
    s.src='https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js';
    s.onload=resolve; s.onerror=reject;
    document.head.appendChild(s);
  });
}

async function openGlobalSearch(){
  const m=ensureSearchModal();
  applyTranslations();
  // placeholder translation
  const inp=m.querySelector('#mdtSearchInput');
  inp.placeholder = (translations[currentLang] && translations[currentLang]['search_placeholder']) || 'Search…';
  // If we have a last scan, prefill
  try{
    const last=JSON.parse(localStorage.getItem('mdt_last_scan_value')||'null');
    if(last?.value) inp.value = last.value;
  }catch{}
  renderGlobalSearchResults(inp.value);

  try{
    await ensureBootstrap();
    const modal=new bootstrap.Modal(m);
    modal.show();
    setTimeout(()=>inp.focus(), 150);
  }catch{
    // fallback
    m.style.display='block';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  applyTranslations();
  setupLanguageSelector();
  headerEnhancements();
});

// PWA: inject manifest link + register service worker (works on GitHub Pages HTTPS)
(function(){
  try{
    if(!document.querySelector('link[rel="manifest"]')){
      const link=document.createElement("link");
      link.rel="manifest";
      link.href=(window.location.pathname.includes("/production/")||window.location.pathname.includes("/warehouse/")||window.location.pathname.includes("/documents/")||window.location.pathname.includes("/admin/")||window.location.pathname.includes("/analytics/")||window.location.pathname.includes("/procurement/")||window.location.pathname.includes("/integration/")) ? "../manifest.json" : "manifest.json";
      document.head.appendChild(link);
    }
    if(!document.querySelector('meta[name="theme-color"]')){
      const meta=document.createElement("meta");
      meta.name="theme-color";
      meta.content="#1b5e20";
      document.head.appendChild(meta);
    }
    if("serviceWorker" in navigator){
      const swPath=(window.location.pathname.split("/").length>2) ? "../sw.js" : "sw.js";
      navigator.serviceWorker.register(swPath).catch(()=>{});
    }
  }catch(e){}
})();


// mdt_scan_return: populate a field after returning from scanner.html
(function(){
  try{
    const sp=new URLSearchParams(window.location.search);
    const tgt=sp.get('scan_target');
    const ok=sp.get('scan')==='1';
    if(ok && tgt){
      const raw=localStorage.getItem('mdt_last_scan_value');
      const val=raw? (JSON.parse(raw).value||'') : '';
      const el=document.getElementById(tgt);
      if(el && val){
        if(el.tagName==='SELECT'){
          // Try exact value match first
          let opt=[...el.options].find(o=>o.value===val);
          if(!opt){
            const vLower=val.toLowerCase();
            opt=[...el.options].find(o=>(o.textContent||'').toLowerCase().includes(vLower));
          }
          if(opt) el.value=opt.value;
        } else {
          el.value=val;
        }
        el.dispatchEvent(new Event('change', {bubbles:true}));
        el.focus?.();
      }
      // Clean URL
      sp.delete('scan'); sp.delete('scan_target');
      const base=window.location.pathname;
      const qs=sp.toString();
      window.history.replaceState({},'', base + (qs?('?'+qs):''));
    }

    // Delegate: click .scan-fill to open scanner and return to this page
    document.addEventListener('click', (e)=>{
      const btn=e.target.closest?.('.scan-fill');
      if(!btn) return;
      const target=btn.getAttribute('data-target');
      if(!target) return;
      const here=window.location.pathname + window.location.search;
      const url='scanner.html?return=' + encodeURIComponent(here) + '&target=' + encodeURIComponent(target);
      window.location.href=url;
    });
  }catch(_){/* ignore */}
})();


// --- UX helpers: responsive tables (mobile) ---
function enhanceResponsiveTables(){
  try{
    document.querySelectorAll("table.responsive-table").forEach(table=>{
      const headers = Array.from(table.querySelectorAll("thead th")).map(th=>th.textContent.trim());
      table.querySelectorAll("tbody tr").forEach(tr=>{
        Array.from(tr.children).forEach((td, i)=>{
          if(td && !td.getAttribute("data-label")){
            td.setAttribute("data-label", headers[i] || "");
          }
        });
      });
    });
  }catch(_){}
}
document.addEventListener("DOMContentLoaded", enhanceResponsiveTables);

try{
  window.mdtEnhanceResponsiveTables = enhanceResponsiveTables;
  const mo = new MutationObserver(()=>{ try{ enhanceResponsiveTables(); }catch{} });
  mo.observe(document.documentElement, { childList:true, subtree:true });
}catch(_){}
