"use client";

import { useSettingsStore } from "@/store/settings";
import { localeNames, type Locale } from "@/lib/i18n";

const locales: Locale[] = ["en", "ru", "uz"];

export function LocaleSwitcher() {
  const { locale, setLocale } = useSettingsStore();

  return (
    <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5">
      {locales.map((l) => (
        <button
          key={l}
          onClick={() => setLocale(l)}
          className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-all duration-200 ${
            locale === l
              ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
        >
          {localeNames[l]}
        </button>
      ))}
    </div>
  );
}
