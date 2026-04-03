"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import type { Product } from "@/lib/schema";

export function ProductsTable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editMinStock, setEditMinStock] = useState("");
  const [loading, setLoading] = useState(true);
  const debounceTimer = useRef<ReturnType<typeof setTimeout>>(null);

  // Debounce search input (300ms)
  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [search]);

  const fetchProducts = useCallback(async () => {
    const params = debouncedSearch
      ? `?search=${encodeURIComponent(debouncedSearch)}`
      : "";
    try {
      const res = await fetch(`/api/products${params}`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch {
      // Silently fail on network errors, will retry on next interval
    } finally {
      setLoading(false);
    }
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
        body: JSON.stringify({
          id,
          name: editName,
          minStock: Number(editMinStock),
        }),
      });
      if (res.ok) {
        setEditingId(null);
        fetchProducts();
      }
    } catch {
      // Keep edit mode open on failure
    }
  };

  const cancelEdit = () => setEditingId(null);

  const lowCount = products.filter((p) => p.stock <= p.minStock).length;
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);

  return (
    <div className="space-y-5">
      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm px-4 py-3">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            Products
          </p>
          <p className="text-2xl font-semibold text-gray-900 mt-0.5">
            {products.length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm px-4 py-3">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            Total Stock
          </p>
          <p className="text-2xl font-semibold text-gray-900 mt-0.5">
            {totalStock.toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm px-4 py-3">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            Low Stock
          </p>
          <p
            className={`text-2xl font-semibold mt-0.5 ${
              lowCount > 0 ? "text-red-600" : "text-gray-900"
            }`}
          >
            {lowCount}
          </p>
        </div>
      </div>

      {/* Search */}
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
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200/80 rounded-xl text-[14px] text-gray-900 placeholder:text-gray-400 shadow-sm focus:border-gray-300 focus:ring-2 focus:ring-gray-100 transition-all"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                  Barcode
                </th>
                <th className="px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider text-right">
                  Stock
                </th>
                <th className="px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider text-right">
                  Min
                </th>
                <th className="px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider text-center">
                  Status
                </th>
                <th className="px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center">
                    <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
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
                      Loading...
                    </div>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-12 text-center text-gray-400 text-sm"
                  >
                    {search
                      ? "No products match your search"
                      : "No products yet"}
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  const isLow = product.stock <= product.minStock;
                  const isEditing = editingId === product.id;

                  return (
                    <tr
                      key={product.id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-gray-300 focus:ring-1 focus:ring-gray-200"
                            autoFocus
                          />
                        ) : (
                          <span className="text-[14px] font-medium text-gray-900">
                            {product.name}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[13px] text-gray-500 font-mono">
                          {product.barcode}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span
                          className={`text-[15px] font-semibold tabular-nums ${
                            isLow ? "text-red-600" : "text-gray-900"
                          }`}
                        >
                          {product.stock.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {isEditing ? (
                          <input
                            type="number"
                            value={editMinStock}
                            onChange={(e) => setEditMinStock(e.target.value)}
                            className="w-16 px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-right focus:border-gray-300 focus:ring-1 focus:ring-gray-200"
                          />
                        ) : (
                          <span className="text-[13px] text-gray-400 tabular-nums">
                            {product.minStock}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {isLow ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-red-50 text-red-600 border border-red-100">
                            LOW
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100">
                            OK
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {isEditing ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => saveEdit(product.id)}
                              className="px-2.5 py-1.5 bg-gray-900 text-white text-[12px] font-medium rounded-lg hover:bg-gray-800 transition-colors"
                            >
                              Save
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="px-2.5 py-1.5 bg-gray-100 text-gray-600 text-[12px] font-medium rounded-lg hover:bg-gray-200 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => startEdit(product)}
                            className="px-2.5 py-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 text-[12px] font-medium rounded-lg transition-colors"
                          >
                            Edit
                          </button>
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

      {/* Footer */}
      <p className="text-[11px] text-gray-400 text-right">
        {products.length} product{products.length !== 1 ? "s" : ""} &middot;
        auto-refresh 5s
      </p>
    </div>
  );
}
