"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useSettingsStore } from "@/store/settings";
import { useT } from "@/lib/i18n";

interface BarcodeScannerProps {
  onScan: (barcode: string) => void;
  onClose: () => void;
}

export function BarcodeScanner({ onScan, onClose }: BarcodeScannerProps) {
  const locale = useSettingsStore((s) => s.locale);
  const t = useT(locale);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const scanner = new Html5Qrcode("barcode-reader");
    scannerRef.current = scanner;

    scanner
      .start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 280, height: 120 },
          aspectRatio: 1.0,
        },
        (decodedText) => {
          scanner.stop().then(() => {
            onScan(decodedText);
          });
        },
        () => {
          // ignore scan failures (no barcode in frame)
        }
      )
      .catch((err) => {
        setError(String(err));
      });

    return () => {
      if (scannerRef.current?.isScanning) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, [onScan]);

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-colors"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 6 6 18" /><path d="m6 6 12 12" />
        </svg>
      </button>

      {/* Title */}
      <p className="text-white/80 text-sm font-medium mb-4">{t("scanWithCamera")}</p>

      {/* Scanner viewport */}
      <div className="relative w-[300px] h-[300px] rounded-2xl overflow-hidden">
        <div id="barcode-reader" className="w-full h-full" />
        {/* Corner guides */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-10 h-10 border-t-3 border-l-3 border-white/80 rounded-tl-lg" />
          <div className="absolute top-0 right-0 w-10 h-10 border-t-3 border-r-3 border-white/80 rounded-tr-lg" />
          <div className="absolute bottom-0 left-0 w-10 h-10 border-b-3 border-l-3 border-white/80 rounded-bl-lg" />
          <div className="absolute bottom-0 right-0 w-10 h-10 border-b-3 border-r-3 border-white/80 rounded-br-lg" />
        </div>
      </div>

      {error && (
        <div className="mt-4 px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300 text-sm text-center max-w-[300px]">
          {error}
        </div>
      )}

      <p className="text-white/40 text-xs mt-4">{t("pointAtBarcode")}</p>
    </div>
  );
}
