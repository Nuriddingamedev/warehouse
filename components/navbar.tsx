"use client";

import { WarehouseIcon } from "./warehouse-icon";
import { ThemeToggle } from "./theme-toggle";
import { LocaleSwitcher } from "./locale-switcher";
import { useSettingsStore } from "@/store/settings";
import { useT } from "@/lib/i18n";

interface NavbarProps {
  activeTab: "products" | "scanner" | "history";
  onTabChange: (tab: "products" | "scanner" | "history") => void;
}

export function Navbar({ activeTab, onTabChange }: NavbarProps) {
  const locale = useSettingsStore((s) => s.locale);
  const t = useT(locale);

  const tabs = [
    { key: "products" as const, label: t("products") },
    { key: "scanner" as const, label: t("scanner") },
    { key: "history" as const, label: t("history") },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200/60 dark:border-gray-800/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gray-900 dark:bg-gray-100 flex items-center justify-center">
            <WarehouseIcon size={16} className="text-white dark:text-gray-900" />
          </div>
          <span className="text-[15px] font-semibold text-gray-900 dark:text-gray-100 tracking-tight">
            {t("inventory")}
          </span>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Tabs */}
          <nav className="flex items-center bg-gray-100/80 dark:bg-gray-800/80 rounded-lg p-0.5">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => onTabChange(tab.key)}
                className={`px-3.5 py-1.5 rounded-md text-[13px] font-medium transition-all duration-200 ${
                  activeTab === tab.key
                    ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          <LocaleSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
