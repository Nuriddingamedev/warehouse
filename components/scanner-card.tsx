"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { useInventoryStore } from "@/store/inventory";
import { useSettingsStore } from "@/store/settings";
import { useT } from "@/lib/i18n";

export function ScannerCard() {
  const {
    mode, setMode,
    isNewProduct, setIsNewProduct,
    status, setStatus,
    loading, setLoading,
    reset,
  } = useInventoryStore();

  const locale = useSettingsStore((s) => s.locale);
  const t = useT(locale);

  const [barcode, setBarcode] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [name, setName] = useState("");
  const barcodeRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const scanBuffer = useRef("");
  const scanTimer = useRef<ReturnType<typeof setTimeout>>(null);

  // Auto-focus barcode input
  useEffect(() => {
    if (!isNewProduct) barcodeRef.current?.focus();
  }, [status, isNewProduct]);

  // Focus name input for new product
  useEffect(() => {
    if (isNewProduct) setTimeout(() => nameRef.current?.focus(), 50);
  }, [isNewProduct]);

  // Keep focus on barcode input (scanner sends input to focused element)
  useEffect(() => {
    const refocus = () => {
      if (!isNewProduct && document.activeElement?.tagName !== "INPUT") {
        barcodeRef.current?.focus();
      }
    };
    window.addEventListener("click", refocus);
    return () => window.removeEventListener("click", refocus);
  }, [isNewProduct]);

  // Handle rapid scanner input: buffer keystrokes, detect scanner vs manual
  // Scanners type 10+ chars in <100ms, humans type ~1 char per 100-300ms
  const handleBarcodeKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      // If we have buffered scanner input, use it
      if (scanBuffer.current.length > 0) {
        setBarcode(scanBuffer.current);
        scanBuffer.current = "";
        if (scanTimer.current) clearTimeout(scanTimer.current);
      }
      // Submit form programmatically
      const form = (e.target as HTMLElement).closest("form");
      if (form) form.requestSubmit();
    }
  }, []);

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();
      const trimmedBarcode = barcode.trim();
      if (!trimmedBarcode || !quantity || Number(quantity) <= 0) return;
      if (loading) return;

      setLoading(true);
      setStatus({ type: "idle", message: "" });

      try {
        const res = await fetch("/api/stock", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            barcode: trimmedBarcode,
            quantity: Number(quantity),
            mode,
            name: isNewProduct ? name : undefined,
          }),
        });

        const data = await res.json();

        if (data.message === "NEW_PRODUCT" && mode === "IN") {
          setIsNewProduct(true);
          setLoading(false);
          return;
        }

        if (data.success) {
          setStatus({ type: "success", message: data.message });
          setBarcode("");
          setQuantity("1");
          setName("");
          setIsNewProduct(false);
          setTimeout(() => barcodeRef.current?.focus(), 100);
        } else {
          setStatus({ type: "error", message: data.message });
          // Re-focus barcode on error too so scanner can retry
          setTimeout(() => barcodeRef.current?.focus(), 100);
        }
      } catch {
        setStatus({ type: "error", message: t("connectionError") });
      } finally {
        setLoading(false);
      }
    },
    [barcode, quantity, mode, name, isNewProduct, loading, setLoading, setStatus, setIsNewProduct, t]
  );

  const handleClear = () => {
    reset();
    setBarcode("");
    setQuantity("1");
    setName("");
    setTimeout(() => barcodeRef.current?.focus(), 50);
  };

  const isIn = mode === "IN";

  return (
    <div className="w-full max-w-[480px] mx-auto">
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-sm overflow-hidden">
        {/* Mode Toggle */}
        <div className="p-5 pb-0">
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1 gap-1">
            <button
              type="button"
              onClick={() => { setMode("IN"); handleClear(); }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                isIn
                  ? "bg-emerald-500 text-white shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              {t("stockIn")}
            </button>
            <button
              type="button"
              onClick={() => { setMode("OUT"); handleClear(); }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                !isIn
                  ? "bg-red-500 text-white shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              {t("stockOut")}
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Barcode */}
          <div className="space-y-1.5">
            <label htmlFor="barcode" className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {t("barcode")}
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 5v14" /><path d="M8 5v14" /><path d="M12 5v14" /><path d="M17 5v14" /><path d="M21 5v14" />
                </svg>
              </div>
              <input
                id="barcode"
                name="barcode"
                ref={barcodeRef}
                type="text"
                value={barcode}
                onChange={(e) => { setBarcode(e.target.value); setIsNewProduct(false); setStatus({ type: "idle", message: "" }); }}
                onKeyDown={handleBarcodeKeyDown}
                placeholder={t("scanOrEnter")}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-[15px] text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:bg-white dark:focus:bg-gray-800 focus:border-gray-300 dark:focus:border-gray-600 focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700 transition-all"
                autoComplete="off"
                disabled={loading}
              />
            </div>
          </div>

          {/* Quantity */}
          <div className="space-y-1.5">
            <label htmlFor="quantity" className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {t("quantity")}
            </label>
            <input
              id="quantity"
              name="quantity"
              type="number"
              value={quantity}
              onChange={(e) => { const val = e.target.value; if (val === "" || Number(val) >= 0) setQuantity(val); }}
              placeholder="1"
              min="1"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-[15px] text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:bg-white dark:focus:bg-gray-800 focus:border-gray-300 dark:focus:border-gray-600 focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700 transition-all"
              disabled={loading}
            />
          </div>

          {/* New Product Name */}
          {isNewProduct && isIn && (
            <div className="space-y-1.5">
              <label htmlFor="productName" className="block text-xs font-medium text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                {t("newProduct")}
              </label>
              <input
                id="productName"
                name="productName"
                ref={nameRef}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("productName")}
                className="w-full px-4 py-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl text-[15px] text-gray-900 dark:text-gray-100 placeholder:text-amber-400 dark:placeholder:text-amber-600 focus:bg-white dark:focus:bg-gray-800 focus:border-amber-300 dark:focus:border-amber-700 focus:ring-2 focus:ring-amber-100 dark:focus:ring-amber-900 transition-all"
                disabled={loading}
              />
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !barcode.trim() || !quantity || Number(quantity) <= 0}
            className={`w-full py-3.5 rounded-xl text-[15px] font-semibold text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] ${
              isIn
                ? "bg-emerald-500 hover:bg-emerald-600 shadow-sm shadow-emerald-200 dark:shadow-emerald-900/30"
                : "bg-red-500 hover:bg-red-600 shadow-sm shadow-red-200 dark:shadow-red-900/30"
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                {t("processing")}
              </span>
            ) : isIn ? t("stockIn") : t("stockOut")}
          </button>
        </form>

        {/* Status Feedback */}
        {status.type !== "idle" && (
          <div className="px-5 pb-5">
            <div className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-[13px] font-medium ${
              status.type === "success"
                ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60"
                : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200/60 dark:border-red-800/60"
            }`}>
              {status.type === "success" ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><path d="M20 6 9 17l-5-5" /></svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><circle cx="12" cy="12" r="10" /><path d="m15 9-6 6" /><path d="m9 9 6 6" /></svg>
              )}
              {status.message}
            </div>
          </div>
        )}
      </div>

      {/* Clear */}
      <button
        type="button"
        onClick={handleClear}
        className="w-full mt-3 py-2 text-[13px] text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
      >
        {t("clearForm")}
      </button>
    </div>
  );
}
