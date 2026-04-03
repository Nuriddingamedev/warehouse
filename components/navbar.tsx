"use client";

interface NavbarProps {
  activeTab: "products" | "scanner";
  onTabChange: (tab: "products" | "scanner") => void;
}

export function Navbar({ activeTab, onTabChange }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gray-900 flex items-center justify-center">
            <svg
              width="14"
              height="14"
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
          <span className="text-[15px] font-semibold text-gray-900 tracking-tight">
            Inventory
          </span>
        </div>

        {/* Tabs */}
        <nav className="flex items-center bg-gray-100/80 rounded-lg p-0.5">
          <button
            onClick={() => onTabChange("products")}
            className={`px-3.5 py-1.5 rounded-md text-[13px] font-medium transition-all duration-200 ${
              activeTab === "products"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Products
          </button>
          <button
            onClick={() => onTabChange("scanner")}
            className={`px-3.5 py-1.5 rounded-md text-[13px] font-medium transition-all duration-200 ${
              activeTab === "scanner"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Scanner
          </button>
        </nav>
      </div>
    </header>
  );
}
