"use client";

import { useEffect, useState, useCallback } from "react";
import { useSettingsStore } from "@/store/settings";
import { useT } from "@/lib/i18n";

interface Movement {
  id: string;
  type: "IN" | "OUT";
  quantity: number;
  createdAt: string;
  productName: string;
  productBarcode: string;
}

interface Stats {
  totalIn: number;
  totalOut: number;
  countIn: number;
  countOut: number;
}

export function HistoryTable() {
  const locale = useSettingsStore((s) => s.locale);
  const t = useT(locale);

  const [movements, setMovements] = useState<Movement[]>([]);
  const [stats, setStats] = useState<Stats>({ totalIn: 0, totalOut: 0, countIn: 0, countOut: 0 });
  const [loading, setLoading] = useState(true);

  const fetchHistory = useCallback(async () => {
    try {
      const res = await fetch("/api/history");
      if (res.ok) {
        const data = await res.json();
        setMovements(data.movements);
        setStats(data.stats);
      }
    } catch { /* retry */ } finally { setLoading(false); }
  }, []);

  useEffect(() => {
    fetchHistory();
    const interval = setInterval(fetchHistory, 5000);
    return () => clearInterval(interval);
  }, [fetchHistory]);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString(locale === "uz" ? "uz-UZ" : locale === "ru" ? "ru-RU" : "en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const cardClass = "bg-white dark:bg-gray-900 rounded-xl border border-gray-200/80 dark:border-gray-800 shadow-sm";

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className={`${cardClass} px-4 py-3`}>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t("totalInQty")}</p>
          <p className="text-2xl font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">{stats.totalIn.toLocaleString()}</p>
        </div>
        <div className={`${cardClass} px-4 py-3`}>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t("totalOutQty")}</p>
          <p className="text-2xl font-semibold text-red-600 dark:text-red-400 mt-0.5">{stats.totalOut.toLocaleString()}</p>
        </div>
        <div className={`${cardClass} px-4 py-3`}>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t("inCount")}</p>
          <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mt-0.5">{stats.countIn}</p>
        </div>
        <div className={`${cardClass} px-4 py-3`}>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t("outCount")}</p>
          <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mt-0.5">{stats.countOut}</p>
        </div>
      </div>

      {/* Table */}
      <div className={`${cardClass} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <th className="px-4 py-3 text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t("type")}</th>
                <th className="px-4 py-3 text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t("product")}</th>
                <th className="px-4 py-3 text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t("barcode")}</th>
                <th className="px-4 py-3 text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">{t("quantity")}</th>
                <th className="px-4 py-3 text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">{t("date")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center">
                    <div className="flex items-center justify-center gap-2 text-gray-400 dark:text-gray-500 text-sm">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      {t("loading")}
                    </div>
                  </td>
                </tr>
              ) : movements.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-gray-400 dark:text-gray-500 text-sm">
                    {t("noHistory")}
                  </td>
                </tr>
              ) : (
                movements.map((m) => (
                  <tr key={m.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-4 py-3">
                      {m.type === "IN" ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5"/><path d="m5 12 7-7 7 7"/></svg>
                          IN
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-800">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>
                          OUT
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[14px] font-medium text-gray-900 dark:text-gray-100">{m.productName}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[13px] text-gray-500 dark:text-gray-400 font-mono">{m.productBarcode}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={`text-[15px] font-semibold tabular-nums ${m.type === "IN" ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
                        {m.type === "IN" ? "+" : "-"}{m.quantity}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-[13px] text-gray-400 dark:text-gray-500">{formatDate(m.createdAt)}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-[11px] text-gray-400 dark:text-gray-500 text-right">
        {t("movementCount", movements.length)} &middot; {t("autoRefresh")}
      </p>
    </div>
  );
}
