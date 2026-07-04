import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Q-Broker — Hệ sinh thái BĐS toàn diện (Demo)",
  description: "Demo giao diện đa vai trò cho hệ sinh thái Q-Broker",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="font-sans">{children}</body>
    </html>
  );
}
