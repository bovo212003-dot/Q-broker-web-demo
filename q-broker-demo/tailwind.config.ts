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
        // Màu thương hiệu Automation Land (dùng cho module Đào tạo /realtor/dao-tao)
        // Lấy theo logo: xanh "AUTOMATION" (500) -> navy "LAND" (700), gear xám.
        al: {
          50: "#eef4fb",
          100: "#d7e6f5",
          200: "#b0cbe9",
          300: "#7ea9d8",
          400: "#4f86c6",
          500: "#2f6db4", // xanh AUTOMATION — primary
          600: "#255893",
          700: "#1c3e70", // navy LAND — dùng cho tiêu đề/nền đậm
          800: "#172f54",
          900: "#122544",
          gear: "#8a939c", // xám bánh răng
        },
        // Màu cam highlight (nhấn CTA, badge, chỉ báo active)
        flame: {
          50: "#fff5ed",
          100: "#ffe6d3",
          400: "#ff9142",
          500: "#f97316", // cam chủ đạo highlight
          600: "#e25c00",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "pop-in": {
          "0%": { opacity: "0", transform: "scale(.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        kenburns: {
          "0%": { transform: "scale(1) translate(0, 0)" },
          "100%": { transform: "scale(1.12) translate(-2%, -1%)" },
        },
        "slide-in-right": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        // Thanh tiến trình cảnh (hero intro): lấp đầy từ trái sang phải.
        progress: {
          "0%": { transform: "scaleX(0)" },
          "100%": { transform: "scaleX(1)" },
        },
        // Màn quét màu chéo khi chuyển cảnh (hero intro).
        wipe: {
          "0%": { transform: "translateX(-130%) skewX(-10deg)" },
          "100%": { transform: "translateX(130%) skewX(-10deg)" },
        },
      },
      animation: {
        "fade-up": "fade-up .5s ease-out both",
        "fade-in": "fade-in .5s ease-out both",
        "pop-in": "pop-in .4s ease-out both",
        marquee: "marquee 24s linear infinite",
        float: "float 4s ease-in-out infinite",
        shimmer: "shimmer 2.2s linear infinite",
        kenburns: "kenburns 18s ease-in-out infinite alternate",
        "slide-in-right": "slide-in-right .3s ease-out both",
        progress: "progress 5s linear forwards",
        wipe: "wipe .8s cubic-bezier(.7,0,.3,1) forwards",
      },
    },
  },
  plugins: [],
};

export default config;
