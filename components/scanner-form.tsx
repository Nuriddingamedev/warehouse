"use client";

import { useRef, useState, useEffect } from "react";
import { useInventoryStore } from "@/store/inventory";

export function ScannerForm() {
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
  const [quantity, setQuantity] = useState("");
  const [name, setName] = useState("");
  const barcodeRef = useRef<HTMLInputElement>(null);

  // Auto-focus barcode input
  useEffect(() => {
    barcodeRef.current?.focus();
  }, [status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!barcode || !quantity) return;

    setLoading(true);
    setStatus({ type: "idle", message: "" });

    try {
      const res = await fetch("/api/stock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          barcode,
          quantity: Number(quantity),
          mode,
          name: isNewProduct ? name : undefined,
        }),
      });

      const data = await res.json();

      if (data.message === "NEW_PRODUCT") {
        setIsNewProduct(true);
        setLoading(false);
        return;
      }

      if (data.success) {
        setStatus({ type: "success", message: data.message });
        setBarcode("");
        setQuantity("");
        setName("");
        setIsNewProduct(false);
        setTimeout(() => {
          barcodeRef.current?.focus();
        }, 100);
      } else {
        setStatus({ type: "error", message: data.message });
      }
    } catch {
      setStatus({ type: "error", message: "Connection error" });
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    reset();
    setBarcode("");
    setQuantity("");
    setName("");
    barcodeRef.current?.focus();
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Mode Toggle */}
      <div className="flex mb-6 rounded-lg overflow-hidden border border-gray-200">
        <button
          type="button"
          onClick={() => {
            setMode("IN");
            handleClear();
          }}
          className={`flex-1 py-3 text-lg font-bold transition-colors ${
            mode === "IN"
              ? "bg-green-500 text-white"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          IN
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("OUT");
            handleClear();
          }}
          className={`flex-1 py-3 text-lg font-bold transition-colors ${
            mode === "OUT"
              ? "bg-red-500 text-white"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          OUT
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Barcode
          </label>
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
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            autoComplete="off"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Quantity
          </label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Enter quantity"
            min="1"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            disabled={loading}
          />
        </div>

        {/* New product name field */}
        {isNewProduct && mode === "IN" && (
          <div className="animate-in fade-in">
            <label className="block text-sm font-medium text-orange-600 mb-1">
              New product — enter name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Product name"
              className="w-full px-4 py-3 border border-orange-300 rounded-lg text-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none bg-orange-50"
              autoFocus
              disabled={loading}
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !barcode || !quantity}
          className={`w-full py-4 rounded-lg text-lg font-bold text-white transition-colors disabled:opacity-50 ${
            mode === "IN"
              ? "bg-green-500 hover:bg-green-600"
              : "bg-red-500 hover:bg-red-600"
          }`}
        >
          {loading ? "Processing..." : `${mode === "IN" ? "Stock In" : "Stock Out"}`}
        </button>
      </form>

      {/* Status */}
      {status.type !== "idle" && (
        <div
          className={`mt-4 p-4 rounded-lg text-center text-lg font-medium ${
            status.type === "success"
              ? "bg-green-100 text-green-800 border border-green-300"
              : "bg-red-100 text-red-800 border border-red-300"
          }`}
        >
          {status.message}
        </div>
      )}

      {/* Clear button */}
      <button
        type="button"
        onClick={handleClear}
        className="w-full mt-3 py-2 text-gray-500 hover:text-gray-700 text-sm"
      >
        Clear
      </button>
    </div>
  );
}
