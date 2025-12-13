export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: { extend: {} },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        bloodwave: {
          primary: "#E94031",
          secondary: "#F07E33",
          accent: "#E94031",
          neutral: "#1f2937",
          "base-100": "#ffffff",
          "base-200": "#f8f1ee",
          "base-300": "#efe3df",
          info: "#0ea5e9",
          success: "#22c55e",
          warning: "#f59e0b",
          error: "#ef4444"
        }
      }
    ]
  }
};