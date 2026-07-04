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
