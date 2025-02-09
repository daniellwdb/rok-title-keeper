/* eslint-disable @typescript-eslint/no-var-requires */
const { fontFamily } = require("tailwindcss/defaultTheme");
const plugin = require("tailwindcss/plugin");
const colors = require("tailwindcss/colors");

function withOpacityValue(variable) {
  return ({ opacityValue }) => {
    if (opacityValue === undefined) {
      return `rgb(var(${variable}))`;
    }
    return `rgb(var(${variable}) / ${opacityValue})`;
  };
}

/** @type {import("@types/tailwindcss/tailwind-config").TailwindConfig } */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        primary: ["Inter", ...fontFamily.sans],
      },
      backdropFilter: {
        none: "none",
        blur: "blur(20px)",
      },
      colors: {
        transparent: "transparent",
        white: "#fff",
        pink: colors.pink,
        "black-glass": "rgba(0, 0, 0, 0.23)",
        gray: {
          DEFAULT: "#121212",
          50: "#bdbdbd",
          100: "#a1a1a1",
          200: "#404040",
          300: "#34343b",
          400: "#2d2d33",
          500: "#212126",
          600: "#1d1d21",
          700: "#18181c",
          800: "#121214",
          // 800: "#121214",
          900: "#0b0b0d",
        },
        blue: {
          DEFAULT: "#5438dc",
          50: "#f6f5fd",
          100: "#eeebfc",
          200: "#d4cdf6",
          300: "#bbaff1",
          400: "#8774e7",
          500: "#5438dc",
          600: "#4c32c6",
          700: "#3f2aa5",
          800: "#322284",
          900: "#291b6c",
        },
        red: {
          DEFAULT: "#ff3c3c",
          50: "#fff5f5",
          100: "#ffecec",
          200: "#ffcece",
          300: "#ffb1b1",
          400: "#ff7777",
          500: "#ff3c3c",
          600: "#e63636",
          700: "#bf2d2d",
          800: "#992424",
          900: "#7d1d1d",
        },
        orange: {
          DEFAULT: "#DA552F",
          50: "#FDF4F2",
          100: "#F9E3DC",
          200: "#F1BFB1",
          300: "#E99C86",
          400: "#E2785A",
          500: "#DA552F",
          600: "#B64220",
          700: "#8A3219",
          800: "#5F2211",
          900: "#341309",
        },
        green: {
          DEFAULT: "#32e875",
          50: "#f5fef8",
          100: "#ebfdf1",
          200: "#ccf9dd",
          300: "#adf6c8",
          400: "#70ef9e",
          500: "#32e875",
          600: "#2dd169",
          700: "#26ae58",
          800: "#1e8b46",
          900: "#197239",
        },
      },
      keyframes: {
        flicker: {
          "0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100%": {
            opacity: 0.99,
            filter:
              "drop-shadow(0 0 1px rgba(252, 211, 77)) drop-shadow(0 0 15px rgba(245, 158, 11)) drop-shadow(0 0 1px rgba(252, 211, 77))",
          },
          "20%, 21.999%, 63%, 63.999%, 65%, 69.999%": {
            opacity: 0.4,
            filter: "none",
          },
        },
        shimmer: {
          "0%": {
            backgroundPosition: "-700px 0",
          },
          "100%": {
            backgroundPosition: "700px 0",
          },
        },
      },
      animation: {
        flicker: "flicker 3s linear infinite",
        shimmer: "shimmer 1.3s linear infinite",
      },
    },
  },
  plugins: [
    require("tailwindcss-filters"),
    require("@tailwindcss/forms"),
    plugin(function ({ addVariant, e, postcss }) {
      addVariant("firefox", ({ container, separator }) => {
        const isFirefoxRule = postcss.atRule({
          name: "-moz-document",
          params: "url-prefix()",
        });
        isFirefoxRule.append(container.nodes);
        container.append(isFirefoxRule);
        isFirefoxRule.walkRules((rule) => {
          rule.selector = `.${e(
            `firefox${separator}${rule.selector.slice(1)}`
          )}`;
        });
      });
    }),
  ],
};
