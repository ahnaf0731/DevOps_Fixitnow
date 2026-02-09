/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#161E54",   // Dark Navy
        primaryDark: "#0F1438",
        primaryLight: "#1F2970",
        secondary: "#F16D34", // Vibrant Orange
        accent: "#10B981",    // Emerald
        success: "#10B981",
        warning: "#F59E0B",
        error: "#EF4444",
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #161E54 0%, #1F2970 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #F16D34 0%, #161E54 100%)',
        'gradient-success': 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
      },
    },
  },
  plugins: [],
};
