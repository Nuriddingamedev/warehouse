export type Locale = "en" | "ru" | "uz";

export const localeNames: Record<Locale, string> = {
  en: "EN",
  ru: "RU",
  uz: "UZ",
};

const translations = {
  en: {
    // Home
    warehouse: "Warehouse",
    stockManagement: "Stock management system",
    dashboard: "Dashboard",
    scanner: "Scanner",

    // Navbar
    inventory: "Inventory",
    products: "Products",

    // Scanner
    stockIn: "Stock In",
    stockOut: "Stock Out",
    barcode: "Barcode",
    scanOrEnter: "Scan or enter barcode",
    quantity: "Quantity",
    newProduct: "New Product — Enter Name",
    productName: "Product name",
    processing: "Processing...",
    clearForm: "Clear form",
    connectionError: "Connection error",

    // Telegram
    inventoryScanner: "Inventory Scanner",
    scanBarcodeEnter: "Scan barcode, enter quantity",

    // Products Table
    totalStock: "Total Stock",
    lowStock: "Low Stock",
    searchProducts: "Search products...",
    name: "Name",
    stock: "Stock",
    min: "Min",
    status: "Status",
    actions: "Actions",
    loading: "Loading...",
    noMatch: "No products match your search",
    noProducts: "No products yet",
    low: "LOW",
    ok: "OK",
    save: "Save",
    cancel: "Cancel",
    edit: "Edit",
    autoRefresh: "auto-refresh 5s",
    productCount: (n: number) => `${n} product${n !== 1 ? "s" : ""}`,

    // Theme
    lightMode: "Light",
    darkMode: "Dark",
  },
  ru: {
    warehouse: "Склад",
    stockManagement: "Система управления запасами",
    dashboard: "Панель",
    scanner: "Сканер",

    inventory: "Инвентарь",
    products: "Товары",

    stockIn: "Приход",
    stockOut: "Расход",
    barcode: "Штрихкод",
    scanOrEnter: "Сканируйте или введите штрихкод",
    quantity: "Количество",
    newProduct: "Новый товар — Введите название",
    productName: "Название товара",
    processing: "Обработка...",
    clearForm: "Очистить",
    connectionError: "Ошибка соединения",

    inventoryScanner: "Сканер инвентаря",
    scanBarcodeEnter: "Сканируйте штрихкод, введите количество",

    totalStock: "Всего",
    lowStock: "Мало",
    searchProducts: "Поиск товаров...",
    name: "Название",
    stock: "Остаток",
    min: "Мин",
    status: "Статус",
    actions: "Действия",
    loading: "Загрузка...",
    noMatch: "Товары не найдены",
    noProducts: "Нет товаров",
    low: "МАЛО",
    ok: "ОК",
    save: "Сохр",
    cancel: "Отмена",
    edit: "Ред",
    autoRefresh: "обновление 5с",
    productCount: (n: number) => `${n} товар${n === 1 ? "" : n < 5 ? "а" : "ов"}`,

    lightMode: "Светлая",
    darkMode: "Тёмная",
  },
  uz: {
    warehouse: "Ombor",
    stockManagement: "Zaxiralarni boshqarish tizimi",
    dashboard: "Boshqaruv",
    scanner: "Skaner",

    inventory: "Inventar",
    products: "Mahsulotlar",

    stockIn: "Kirim",
    stockOut: "Chiqim",
    barcode: "Shtrixkod",
    scanOrEnter: "Shtrixkodni skanerlang yoki kiriting",
    quantity: "Miqdor",
    newProduct: "Yangi mahsulot — Nomini kiriting",
    productName: "Mahsulot nomi",
    processing: "Jarayonda...",
    clearForm: "Tozalash",
    connectionError: "Ulanish xatosi",

    inventoryScanner: "Inventar skaneri",
    scanBarcodeEnter: "Shtrixkodni skanerlang, miqdorni kiriting",

    totalStock: "Jami",
    lowStock: "Kam qoldi",
    searchProducts: "Mahsulotlarni qidirish...",
    name: "Nomi",
    stock: "Qoldiq",
    min: "Min",
    status: "Holat",
    actions: "Amallar",
    loading: "Yuklanmoqda...",
    noMatch: "Mahsulot topilmadi",
    noProducts: "Mahsulotlar yo'q",
    low: "KAM",
    ok: "OK",
    save: "Saqlash",
    cancel: "Bekor",
    edit: "Tahrir",
    autoRefresh: "yangilanish 5s",
    productCount: (n: number) => `${n} ta mahsulot`,

    lightMode: "Yorug'",
    darkMode: "Qorong'i",
  },
} as const;

export type TranslationKey = keyof typeof translations.en;

export function t(locale: Locale, key: TranslationKey): string | ((...args: number[]) => string) {
  return translations[locale][key];
}

export function useT(locale: Locale) {
  return (key: TranslationKey, ...args: number[]): string => {
    const val = translations[locale][key];
    if (typeof val === "function") return (val as (...a: number[]) => string)(...args);
    return val as string;
  };
}
