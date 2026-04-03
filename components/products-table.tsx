"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import type { Product } from "@/lib/schema";
import { useSettingsStore } from "@/store/settings";
import { useT } from "@/lib/i18n";

export function ProductsTable() {
  const locale = useSettingsStore((s) => s.locale);
  const t = useT(locale);

  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editMinStock, setEditMinStock] = useState("");
  const [loading, setLoading] = useState(true);
  const debounceTimer = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => setDebouncedSearch(search), 300);
    return () => { if (debounceTimer.current) clearTimeout(debounceTimer.current); };
  }, [search]);

  const fetchProducts = useCallback(async () => {
    const params = debouncedSearch ? `?search=${encodeURIComponent(debouncedSearch)}` : "";
    try {
      const res = await fetch(`/api/products${params}`);
      if (res.ok) setProducts(await res.json());
    } catch { /* retry next interval */ } finally { setLoading(false); }
  }, [debouncedSearch]);

  useEffect(() => {
    fetchProducts();
    const interval = setInterval(fetchProducts, 5000);
    return () => clearInterval(interval);
  }, [fetchProducts]);

  const startEdit = (product: Product) => {
    setEditingId(product.id);
    setEditName(product.name);
    setEditMinStock(String(product.minStock));
  };

  const saveEdit = async (id: string) => {
    try {
      const res = await fetch("/api/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, name: editName, minStock: Number(editMinStock) }),
      });
      if (res.ok) { setEditingId(null); fetchProducts(); }
    } catch { /* keep edit open */ }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm(t("confirmDelete"))) return;
    try {
      const res = await fetch("/api/products", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) { setEditingId(null); fetchProducts(); }
    } catch { /* silent */ }
  };

  const cancelEdit = () => setEditingId(null);

  const lowCount = products.filter((p) => p.stock <= p.minStock).length;
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);

  const cardClass = "bg-white dark:bg-gray-900 rounded-xl border border-gray-200/80 dark:border-gray-800 shadow-sm";
  const inputClass = "bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-gray-100 focus:border-gray-300 dark:focus:border-gray-600 focus:ring-1 focus:ring-gray-200 dark:focus:ring-gray-700";

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className={`${cardClass} px-4 py-3`}>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t("products")}</p>
          <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mt-0.5">{products.length}</p>
        </div>
        <div className={`${cardClass} px-4 py-3`}>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t("totalStock")}</p>
          <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mt-0.5">{totalStock.toLocaleString()}</p>
        </div>
        <div className={`${cardClass} px-4 py-3`}>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t("lowStock")}</p>
          <p className={`text-2xl font-semibold mt-0.5 ${lowCount > 0 ? "text-red-600 dark:text-red-400" : "text-gray-900 dark:text-gray-100"}`}>{lowCount}</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("searchProducts")}
          className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 rounded-xl text-[14px] text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 shadow-sm focus:border-gray-300 dark:focus:border-gray-600 focus:ring-2 focus:ring-gray-100 dark:focus:ring-gray-800 transition-all"
        />
      </div>

      {/* Table */}
      <div className={`${cardClass} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                {[t("name"), t("barcode"), t("stock"), t("min"), t("status"), t("actions")].map((h, i) => (
                  <th key={i} className={`px-4 py-3 text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ${i === 2 || i === 3 ? "text-right" : ""} ${i === 4 ? "text-center" : ""} ${i === 5 ? "text-right" : ""}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center">
                    <div className="flex items-center justify-center gap-2 text-gray-400 dark:text-gray-500 text-sm">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      {t("loading")}
                    </div>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-gray-400 dark:text-gray-500 text-sm">
                    {search ? t("noMatch") : t("noProducts")}
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  const isLow = product.stock <= product.minStock;
                  const isEditing = editingId === product.id;

                  return (
                    <tr key={product.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-4 py-3">
                        {isEditing ? (
                          <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className={`w-full px-2.5 py-1.5 ${inputClass}`} autoFocus />
                        ) : (
                          <span className="text-[14px] font-medium text-gray-900 dark:text-gray-100">{product.name}</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[13px] text-gray-500 dark:text-gray-400 font-mono">{product.barcode}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className={`text-[15px] font-semibold tabular-nums ${isLow ? "text-red-600 dark:text-red-400" : "text-gray-900 dark:text-gray-100"}`}>
                          {product.stock.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {isEditing ? (
                          <input type="number" value={editMinStock} onChange={(e) => setEditMinStock(e.target.value)} className={`w-16 px-2.5 py-1.5 text-right ${inputClass}`} />
                        ) : (
                          <span className="text-[13px] text-gray-400 dark:text-gray-500 tabular-nums">{product.minStock}</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {isLow ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-800">{t("low")}</span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800">{t("ok")}</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {isEditing ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button onClick={() => saveEdit(product.id)} className="px-2.5 py-1.5 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-[12px] font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">{t("save")}</button>
                            <button onClick={() => deleteProduct(product.id)} className="px-2.5 py-1.5 bg-red-500 text-white text-[12px] font-medium rounded-lg hover:bg-red-600 transition-colors">{t("delete")}</button>
                            <button onClick={cancelEdit} className="px-2.5 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-[12px] font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">{t("cancel")}</button>
                          </div>
                        ) : (
                          <button onClick={() => startEdit(product)} className="px-2.5 py-1.5 text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 text-[12px] font-medium rounded-lg transition-colors">{t("edit")}</button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-[11px] text-gray-400 dark:text-gray-500 text-right">
        {t("productCount", products.length)} &middot; {t("autoRefresh")}
      </p>
    </div>
  );
}
