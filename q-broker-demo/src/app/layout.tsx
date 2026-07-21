import type { Metadata } from "next";
import "./globals.css";
import { AiChatWidget } from "@/components/realtor/AiChatWidget";

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
    <html lang="vi" className="scroll-smooth">
      <body className="font-sans">
        {children}
        {/* Chatbot AI nổi, hiển thị ở mọi trang, kéo-thả được */}
        <AiChatWidget />
      </body>
    </html>
  );
}
