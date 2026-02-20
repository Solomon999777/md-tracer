// Common JS for MD Tracer - translations and voice commands
// This script provides multi-language support (English, Russian, Hebrew)
// and a basic speech-to-text command interface using the Web Speech API.

// ===== MDT dependency loader (StoreV2 + Migration) =====
// This helper dynamically injects required scripts for the versioned
// storage (StoreV2) and the legacy migration (migrate_to_v2).
(function loadMDTDeps() {
  const current = document.currentScript && document.currentScript.src;
  const base = current ? current.slice(0, current.lastIndexOf('/') + 1) : 'js/';
  function inject(src) {
    if ([...document.scripts].some(s => (s.src || '').includes(src))) return;
    const el = document.createElement('script');
    el.src = base + src;
    el.defer = true;
    document.head.appendChild(el);
  }
  inject('store_v2.js');
  inject('migrate_to_v2.js');
})();

// Translation dictionary
const translations = {
  en: {
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
    "qb-run-sync": "Run Sync"
    ,
    // Roles
    "role-admin": "Admin",
    "role-manager": "Manager",
    "role-staff": "Staff",
    "role-viewer": "Viewer",
    "role-farmworker": "Farm Worker",
    "role-driver": "Driver"
    ,
    // Logistics module
    "logistics-card-title": "Logistics",
    "logistics-card-desc": "Manage deliveries and route planning.",
    "logistics-title": "Logistics",
    "routes-card-title": "Route Planning",
    "routes-title": "Route Planning",
    "origin-address": "Starting Location",
    "destination-address": "Destination",
    "stop-address": "Stop Address",
    "add-stop": "Add Stop",
    "build-route": "Build Route",
    "generated-link": "Generated Route Link",
    "open-google": "Open in Google Maps",
    "open-waze": "Open in Waze",
    "copy-link": "Copy Link"
  },
  ru: {
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
    "qb-run-sync": "Запустить синхронизацию"
    ,
    // Roles
    "role-admin": "Администратор",
    "role-manager": "Менеджер",
    "role-staff": "Сотрудник",
    "role-viewer": "Наблюдатель",
    "role-farmworker": "Работник фермы",
    "role-driver": "Водитель"
    ,
    // Logistics module
    "logistics-card-title": "Логистика",
    "logistics-card-desc": "Управление доставками и маршрутизацией.",
    "logistics-title": "Логистика",
    "routes-card-title": "Планирование маршрута",
    "routes-title": "Планирование маршрута",
    "origin-address": "Начальная точка",
    "destination-address": "Пункт назначения",
    "stop-address": "Адрес остановки",
    "add-stop": "Добавить остановку",
    "build-route": "Построить маршрут",
    "generated-link": "Сгенерированная ссылка",
    "open-google": "Открыть в Google Картах",
    "open-waze": "Открыть в Waze",
    "copy-link": "Копировать ссылку"
  },
  he: {
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
    "qb-run-sync": "הפעל סנכרון"
    ,
    // Roles
    "role-admin": "מנהל ראשי",
    "role-manager": "מנהל",
    "role-staff": "צוות",
    "role-viewer": "צופה",
    "role-farmworker": "עובד חווה",
    "role-driver": "נהג"
    ,
    // Logistics module
    "logistics-card-title": "לוגיסטיקה",
    "logistics-card-desc": "ניהול משלוחים ותכנון מסלולים.",
    "logistics-title": "לוגיסטיקה",
    "routes-card-title": "תכנון מסלול",
    "routes-title": "תכנון מסלול",
    "origin-address": "מיקום התחלה",
    "destination-address": "יעד",
    "stop-address": "כתובת עצירה",
    "add-stop": "הוסף עצירה",
    "build-route": "בנה מסלול",
    "generated-link": "קישור מסלול שנוצר",
    "open-google": "פתח ב-Google Maps",
    "open-waze": "פתח ב-Waze",
    "copy-link": "העתק קישור"
  }
};

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
  document.querySelectorAll('[data-i18n-key]').forEach(el => {
    const key = el.dataset.i18nKey;
    let translation = translations[lang] && translations[lang][key];
    if (!translation) {
      translation = translations['en'][key] || el.textContent;
    }
    const tag = el.tagName.toLowerCase();
    if (tag === 'input' || tag === 'textarea') {
      el.placeholder = translation;
    } else {
      el.textContent = translation;
    }
  });
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
  // For now, simply alert the command. In production, map to system actions.
  alert('Recognized command: ' + command + '\n(Functionality not implemented)');
}

document.addEventListener('DOMContentLoaded', () => {
  applyTranslations();
  setupLanguageSelector();
  // run migration once dependencies are loaded
  const tryMigrate = () => {
    if (window.MDT_MigrateToV2 && typeof window.MDT_MigrateToV2.migrate === 'function') {
      window.MDT_MigrateToV2.migrate();
      return true;
    }
    return false;
  };
  if (!tryMigrate()) {
    // give injected scripts a moment to load
    setTimeout(() => { tryMigrate(); }, 50);
    setTimeout(() => { tryMigrate(); }, 250);
  }
});