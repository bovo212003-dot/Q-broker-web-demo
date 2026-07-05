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
        // Màu thương hiệu Q-Broker (dùng cho trang clone /realtor)
        realtor: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          500: "#2563eb", // xanh chủ đạo, trùng màu logo Q-Broker
          600: "#1d4ed8",
          700: "#1e40af",
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
