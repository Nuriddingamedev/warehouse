"use client";

import { ScannerCard } from "@/components/scanner-card";

export default function TelegramPage() {
  return (
    <div className="min-h-screen bg-[#f8f9fb] px-4 py-8">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gray-900 mb-3">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
            <path d="m3.3 7 8.7 5 8.7-5" />
            <path d="M12 22V12" />
          </svg>
        </div>
        <h1 className="text-lg font-semibold text-gray-900">
          Inventory Scanner
        </h1>
        <p className="text-[13px] text-gray-500 mt-0.5">
          Scan barcode, enter quantity
        </p>
      </div>

      <ScannerCard />
    </div>
  );
}
