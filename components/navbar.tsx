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
    { key: "products" as const, label: t("products"), icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
    )},
    { key: "scanner" as const, label: t("scanner"), icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/></svg>
    )},
    { key: "history" as const, label: t("history"), icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
    )},
  ];

  return (
    <>
      {/* Desktop navbar */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200/60 dark:border-gray-800/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gray-900 dark:bg-gray-100 flex items-center justify-center">
              <WarehouseIcon size={16} className="text-white dark:text-gray-900" />
            </div>
            <span className="text-[15px] font-semibold text-gray-900 dark:text-gray-100 tracking-tight">
              {t("inventory")}
            </span>
          </div>

          {/* Desktop tabs */}
          <div className="hidden sm:flex items-center gap-2">
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

          {/* Mobile controls */}
          <div className="flex sm:hidden items-center gap-1.5">
            <LocaleSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Mobile bottom tab bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 sm:hidden bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-t border-gray-200/60 dark:border-gray-800/60 safe-area-bottom">
        <div className="flex items-stretch">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              className={`flex-1 flex flex-col items-center gap-1 py-2.5 pt-3 transition-colors ${
                activeTab === tab.key
                  ? "text-gray-900 dark:text-gray-100"
                  : "text-gray-400 dark:text-gray-500"
              }`}
            >
              {tab.icon}
              <span className="text-[10px] font-semibold">{tab.label}</span>
              {activeTab === tab.key && (
                <div className="w-1 h-1 rounded-full bg-gray-900 dark:bg-gray-100" />
              )}
            </button>
          ))}
        </div>
      </nav>
    </>
  );
}
