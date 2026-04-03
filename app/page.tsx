import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="relative flex-1 flex items-center justify-center min-h-screen overflow-hidden">
      {/* Background Image */}
      <Image
        src="/warehouse-bg.jpg"
        alt=""
        fill
        className="object-cover"
        priority
        quality={85}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="relative z-10 text-center space-y-6">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
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
          <h1 className="text-4xl font-bold text-white tracking-tight drop-shadow-lg">
            Warehouse
          </h1>
          <p className="text-white/70 text-[15px] mt-1.5">
            Stock management system
          </p>
        </div>
        <div className="flex gap-3 justify-center">
          <Link
            href="/dashboard"
            className="px-6 py-2.5 bg-white text-gray-900 rounded-xl text-[14px] font-semibold hover:bg-white/90 transition-colors shadow-lg"
          >
            Dashboard
          </Link>
          <Link
            href="/telegram"
            className="px-6 py-2.5 bg-white/10 text-white border border-white/20 backdrop-blur-md rounded-xl text-[14px] font-semibold hover:bg-white/20 transition-colors"
          >
            Scanner
          </Link>
        </div>
      </div>
    </div>
  );
}
