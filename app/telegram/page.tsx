"use client";

import { ScannerCard } from "@/components/scanner-card";
import { WarehouseIcon } from "@/components/warehouse-icon";
import { ThemeToggle } from "@/components/theme-toggle";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { useSettingsStore } from "@/store/settings";
import { useT } from "@/lib/i18n";

export default function TelegramPage() {
  const locale = useSettingsStore((s) => s.locale);
  const t = useT(locale);

  return (
    <div className="min-h-screen bg-[#f8f9fb] dark:bg-[#0f1117] px-4 py-8">
      {/* Top controls */}
      <div className="flex justify-end gap-2 mb-4">
        <LocaleSwitcher />
        <ThemeToggle />
      </div>

      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gray-900 dark:bg-gray-100 mb-3">
          <WarehouseIcon size={22} className="text-white dark:text-gray-900" />
        </div>
        <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {t("inventoryScanner")}
        </h1>
        <p className="text-[13px] text-gray-500 dark:text-gray-400 mt-0.5">
          {t("scanBarcodeEnter")}
        </p>
      </div>

      <ScannerCard />
    </div>
  );
}
