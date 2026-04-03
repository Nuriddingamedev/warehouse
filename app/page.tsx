"use client";

import Link from "next/link";
import Image from "next/image";
import { WarehouseIcon } from "@/components/warehouse-icon";
import { useSettingsStore } from "@/store/settings";
import { useT } from "@/lib/i18n";
import { LocaleSwitcher } from "@/components/locale-switcher";

export default function Home() {
  const locale = useSettingsStore((s) => s.locale);
  const t = useT(locale);

  return (
    <div className="relative flex-1 flex items-center justify-center min-h-screen overflow-hidden">
      {/* Background Image */}
      <Image
        src="/warehouse-bg.jpg"
        alt=""
        fill
        className="object-cover"
        priority
        quality={85}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Language switcher - top right */}
      <div className="absolute top-4 right-4 z-20">
        <LocaleSwitcher />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center space-y-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
          <WarehouseIcon size={44} className="text-white" />
        </div>
        <div>
          <h1 className="text-6xl sm:text-7xl font-bold text-white tracking-tight drop-shadow-lg">
            {t("warehouse")}
          </h1>
          <p className="text-white/70 text-lg sm:text-xl mt-2">
            {t("stockManagement")}
          </p>
        </div>
        <div className="flex gap-4 justify-center">
          <Link
            href="/dashboard"
            className="px-8 py-3.5 bg-white text-gray-900 rounded-xl text-base font-semibold hover:bg-white/90 transition-colors shadow-lg"
          >
            {t("dashboard")}
          </Link>
          <Link
            href="/telegram"
            className="px-8 py-3.5 bg-white/10 text-white border border-white/20 backdrop-blur-md rounded-xl text-base font-semibold hover:bg-white/20 transition-colors"
          >
            {t("scanner")}
          </Link>
        </div>
      </div>
    </div>
  );
}
