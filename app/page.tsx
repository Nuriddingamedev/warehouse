import Link from "next/link";

export default function Home() {
  return (
    <div className="flex-1 flex items-center justify-center bg-[#f8f9fb]">
      <div className="text-center space-y-6">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gray-900">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
            <path d="m3.3 7 8.7 5 8.7-5" />
            <path d="M12 22V12" />
          </svg>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Inventory
          </h1>
          <p className="text-gray-500 text-[15px] mt-1">
            Stock management system
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/dashboard"
            className="px-5 py-2.5 bg-gray-900 text-white rounded-xl text-[14px] font-medium hover:bg-gray-800 transition-colors shadow-sm"
          >
            Dashboard
          </Link>
          <Link
            href="/telegram"
            className="px-5 py-2.5 bg-white text-gray-700 border border-gray-200 rounded-xl text-[14px] font-medium hover:bg-gray-50 transition-colors shadow-sm"
          >
            Scanner
          </Link>
        </div>
      </div>
    </div>
  );
}
