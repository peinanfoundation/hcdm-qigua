import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HCDM 起卦",
  description: "依 HCDM 起卦 v2.4 的選卦組合與八位數起卦",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hant">
      <body>{children}</body>
    </html>
  );
}
