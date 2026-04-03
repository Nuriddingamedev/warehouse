"use client";

import { useEffect, useState, useCallback } from "react";
import type { Product } from "@/lib/schema";

export function ProductTable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editMinStock, setEditMinStock] = useState("");

  const fetchProducts = useCallback(async () => {
    const params = search ? `?search=${encodeURIComponent(search)}` : "";
    const res = await fetch(`/api/products${params}`);
    const data = await res.json();
    setProducts(data);
  }, [search]);

  useEffect(() => {
    fetchProducts();
    // Poll every 5s for realtime-lite
    const interval = setInterval(fetchProducts, 5000);
    return () => clearInterval(interval);
  }, [fetchProducts]);

  const startEdit = (product: Product) => {
    setEditingId(product.id);
    setEditName(product.name);
    setEditMinStock(String(product.minStock));
  };

  const saveEdit = async (id: string) => {
    await fetch("/api/products", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        name: editName,
        minStock: Number(editMinStock),
      }),
    });
    setEditingId(null);
    fetchProducts();
  };

  return (
    <div>
      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or barcode..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-sm font-semibold text-gray-600">
                Name
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-600">
                Barcode
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-600 text-right">
                Stock
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-600 text-right">
                Min Stock
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-600 text-center">
                Status
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-600 text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  {editingId === product.id ? (
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full px-2 py-1 border rounded text-sm"
                    />
                  ) : (
                    <span className="font-medium text-gray-900">
                      {product.name}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-500 text-sm font-mono">
                  {product.barcode}
                </td>
                <td className="px-4 py-3 text-right font-bold text-lg">
                  {product.stock}
                </td>
                <td className="px-4 py-3 text-right">
                  {editingId === product.id ? (
                    <input
                      type="number"
                      value={editMinStock}
                      onChange={(e) => setEditMinStock(e.target.value)}
                      className="w-20 px-2 py-1 border rounded text-sm text-right"
                    />
                  ) : (
                    <span className="text-gray-500">{product.minStock}</span>
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  {product.stock <= product.minStock ? (
                    <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700">
                      LOW
                    </span>
                  ) : (
                    <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">
                      OK
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  {editingId === product.id ? (
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => saveEdit(product.id)}
                        className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => startEdit(product)}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200"
                    >
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-gray-400"
                >
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-xs text-gray-400 text-right">
        {products.length} product{products.length !== 1 ? "s" : ""} — auto-refreshes every 5s
      </p>
    </div>
  );
}
