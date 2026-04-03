import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Inventory Scanner",
  description: "Telegram Mini App for stock management",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function TelegramLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
