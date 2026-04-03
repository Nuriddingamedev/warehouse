"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { ScannerCard } from "@/components/scanner-card";
import { ProductsTable } from "@/components/products-table";

export default function DashboardPage() {
  const [tab, setTab] = useState<"products" | "scanner">("products");

  return (
    <div className="min-h-screen bg-[#f8f9fb] dark:bg-[#0f1117]">
      <Navbar activeTab={tab} onTabChange={setTab} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {tab === "products" ? <ProductsTable /> : <ScannerCard />}
      </main>
    </div>
  );
}
