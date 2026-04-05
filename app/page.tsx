"use client";

import Link from "next/link";
import Image from "next/image";
import { WarehouseIcon } from "@/components/warehouse-icon";
import { useSettingsStore } from "@/store/settings";
import { useT } from "@/lib/i18n";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  const locale = useSettingsStore((s) => s.locale);
  const t = useT(locale);

  return (
    <div className="relative flex-1 flex flex-col min-h-screen overflow-hidden">
      {/* Background Image */}
      <Image
        src="/warehouse-bg.jpg"
        alt=""
        fill
        className="object-cover"
        priority
        quality={85}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/80" />

      {/* Top bar */}
      <div className="relative z-20 flex items-center justify-between px-5 pt-5 sm:pt-6">
        <ThemeToggle />
        <LocaleSwitcher />
      </div>

      {/* Content - pushed to bottom on mobile for thumb reach */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-end pb-12 sm:justify-center sm:pb-0 px-5">
        {/* Icon with glow */}
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-white/20 rounded-3xl blur-xl scale-150" />
          <div className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/25 flex items-center justify-center shadow-2xl">
            <WarehouseIcon size={40} className="text-white" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-5xl sm:text-7xl font-extrabold text-white tracking-tight drop-shadow-2xl">
          {t("warehouse")}
        </h1>
        <p className="text-white/60 text-base sm:text-xl mt-2 font-medium">
          {t("stockManagement")}
        </p>

        {/* Buttons - full width on mobile */}
        <div className="flex flex-col sm:flex-row gap-3 mt-8 w-full max-w-sm sm:max-w-none sm:w-auto">
          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-2 px-8 py-4 sm:py-3.5 bg-white text-gray-900 rounded-2xl sm:rounded-xl text-base font-semibold hover:bg-white/90 active:scale-[0.98] transition-all shadow-xl"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="7" height="7" x="3" y="3" rx="1" /><rect width="7" height="7" x="14" y="3" rx="1" /><rect width="7" height="7" x="14" y="14" rx="1" /><rect width="7" height="7" x="3" y="14" rx="1" />
            </svg>
            {t("dashboard")}
          </Link>
          <Link
            href="/telegram"
            className="flex items-center justify-center gap-2 px-8 py-4 sm:py-3.5 bg-white/10 text-white border border-white/20 backdrop-blur-xl rounded-2xl sm:rounded-xl text-base font-semibold hover:bg-white/20 active:scale-[0.98] transition-all"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 7V5a2 2 0 0 1 2-2h2" /><path d="M17 3h2a2 2 0 0 1 2 2v2" /><path d="M21 17v2a2 2 0 0 1-2 2h-2" /><path d="M7 21H5a2 2 0 0 1-2-2v-2" /><line x1="7" x2="7" y1="8" y2="16" /><line x1="11" x2="11" y1="8" y2="16" /><line x1="15" x2="15" y1="8" y2="16" />
            </svg>
            {t("scanner")}
          </Link>
        </div>
      </div>
    </div>
  );
}
