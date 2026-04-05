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
    <div className="min-h-screen bg-[#f8f9fb] dark:bg-[#0f1117] px-4 py-6 sm:py-8">
      {/* Top controls */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gray-900 dark:bg-gray-100 flex items-center justify-center">
            <WarehouseIcon size={18} className="text-white dark:text-gray-900" />
          </div>
          <span className="text-[15px] font-semibold text-gray-900 dark:text-gray-100">
            {t("inventoryScanner")}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <LocaleSwitcher />
          <ThemeToggle />
        </div>
      </div>

      <ScannerCard />
    </div>
  );
}
