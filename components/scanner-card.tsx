"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { useInventoryStore } from "@/store/inventory";

export function ScannerCard() {
  const {
    mode,
    setMode,
    isNewProduct,
    setIsNewProduct,
    status,
    setStatus,
    loading,
    setLoading,
    reset,
  } = useInventoryStore();

  const [barcode, setBarcode] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [name, setName] = useState("");
  const barcodeRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  // Auto-focus barcode on mount and after status changes
  useEffect(() => {
    if (!isNewProduct) {
      barcodeRef.current?.focus();
    }
  }, [status, isNewProduct]);

  // Focus name input when new product prompt appears
  useEffect(() => {
    if (isNewProduct) {
      // Small delay to let the DOM render the input
      setTimeout(() => nameRef.current?.focus(), 50);
    }
  }, [isNewProduct]);

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

        // Only treat as new product prompt in IN mode
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
          setTimeout(() => barcodeRef.current?.focus(), 50);
        } else {
          setStatus({ type: "error", message: data.message });
        }
      } catch {
        setStatus({ type: "error", message: "Connection error" });
      } finally {
        setLoading(false);
      }
    },
    [barcode, quantity, mode, name, isNewProduct, loading, setLoading, setStatus, setIsNewProduct]
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
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
        {/* Mode Toggle */}
        <div className="p-5 pb-0">
          <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
            <button
              type="button"
              onClick={() => {
                setMode("IN");
                handleClear();
              }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                isIn
                  ? "bg-emerald-500 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Stock In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("OUT");
                handleClear();
              }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                !isIn
                  ? "bg-red-500 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Stock Out
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Barcode */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">
              Barcode
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 5v14" />
                  <path d="M8 5v14" />
                  <path d="M12 5v14" />
                  <path d="M17 5v14" />
                  <path d="M21 5v14" />
                </svg>
              </div>
              <input
                ref={barcodeRef}
                type="text"
                value={barcode}
                onChange={(e) => {
                  setBarcode(e.target.value);
                  setIsNewProduct(false);
                  setStatus({ type: "idle", message: "" });
                }}
                placeholder="Scan or enter barcode"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-[15px] text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-gray-300 focus:ring-2 focus:ring-gray-200 transition-all"
                autoComplete="off"
                disabled={loading}
              />
            </div>
          </div>

          {/* Quantity */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">
              Quantity
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => {
                const val = e.target.value;
                if (val === "" || Number(val) >= 0) setQuantity(val);
              }}
              placeholder="1"
              min="1"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-[15px] text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-gray-300 focus:ring-2 focus:ring-gray-200 transition-all"
              disabled={loading}
            />
          </div>

          {/* New Product Name */}
          {isNewProduct && isIn && (
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-amber-600 uppercase tracking-wider">
                New Product — Enter Name
              </label>
              <input
                ref={nameRef}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Product name"
                className="w-full px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-[15px] text-gray-900 placeholder:text-amber-400 focus:bg-white focus:border-amber-300 focus:ring-2 focus:ring-amber-100 transition-all"
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
                ? "bg-emerald-500 hover:bg-emerald-600 shadow-sm shadow-emerald-200"
                : "bg-red-500 hover:bg-red-600 shadow-sm shadow-red-200"
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Processing...
              </span>
            ) : isIn ? (
              "Stock In"
            ) : (
              "Stock Out"
            )}
          </button>
        </form>

        {/* Status Feedback */}
        {status.type !== "idle" && (
          <div className="px-5 pb-5">
            <div
              className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-[13px] font-medium ${
                status.type === "success"
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                  : "bg-red-50 text-red-700 border border-red-200/60"
              }`}
            >
              {status.type === "success" ? (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="shrink-0"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              ) : (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="shrink-0"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="m15 9-6 6" />
                  <path d="m9 9 6 6" />
                </svg>
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
        className="w-full mt-3 py-2 text-[13px] text-gray-400 hover:text-gray-600 transition-colors"
      >
        Clear form
      </button>
    </div>
  );
}
