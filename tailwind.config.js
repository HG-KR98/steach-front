/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      scrollBehavior: ['responsive', 'motion-safe', 'motion-reduce'],
      fontFamily: {
        dongle: ["Dongle", "sans-serif"],
        "noto-sans": ['"Noto Sans Korean"', "sans-serif"],
        malang: ["HancomMalangMalang-Regular", "sans-serif"],
        lineseed: ["lineseed", "sans-serif"],
      },
      colors: {
        discordChatBg: '#36393F',
        discordChatBg2: '#2F3136',
        discordText: '#FFFFFF',
        hoverNavy: "#36425F",
        lightNavy: "#536493",
        ivory: "#FFFFF0",
        lightBeige: "#F5F5DC",
        lightPink: "#F4A3AF",
        pastelBlue: "#AEC6CF",
        darkGray: "#A9A9A9",
        darkNavy: "#000080",
        coral: "#FF7F50",
        pastelGreen: "#77DD77",
        lightGray: "#D3D3D3",
        lightOrange: "#FFB74D",
        veryLightOrange: "#FFF3E0",
        darkOrange: "#FF9800",
        // #FFF1DB 원래는 이 색
        Beige: "#FFF8F0",
        moreBeige: "#FFF1DB",
        hardBeige: "#D4BDAC",
        darkerBeige: "#B29C89",
        lightBeige: "#DFD3C3",
      },
    },
  },
  plugins: [],
};
