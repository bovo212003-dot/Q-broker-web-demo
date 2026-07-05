import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Màu thương hiệu Q-Broker
        brand: {
          50: "#f0fdfa",
          100: "#ccfbf1",
          500: "#14b8a6",
          600: "#0d9488",
          700: "#0f766e",
          900: "#134e4a",
        },
        // Màu thương hiệu Realtor.com (dùng cho trang clone /realtor)
        realtor: {
          50: "#fef2f2",
          100: "#fee2e2",
          200: "#fecaca",
          500: "#d92228", // đỏ chủ đạo Realtor
          600: "#c01a1f",
          700: "#a11419",
          ink: "#0c0f24", // xanh navy đậm cho văn bản
        },
        // Màu nhấn riêng cho từng role (dùng để phân biệt giao diện demo)
        role: {
          guest: "#64748b", // slate  - Người dùng chưa đăng nhập
          broker: "#059669", // emerald - Môi giới
          customer: "#2563eb", // blue    - Khách hàng
          exchange: "#7c3aed", // violet  - Sàn giao dịch
          bank: "#d97706", // amber   - Ngân hàng
          admin: "#e11d48", // rose    - Admin
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
