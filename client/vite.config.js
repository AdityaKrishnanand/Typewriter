import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// Import Tailwind CSS
import tailwindcss from "tailwindcss"; // Correctly import tailwindcss (not @tailwindcss/postcss)
import autoprefixer from "autoprefixer"; // Import Autoprefixer

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer], // Use the imported plugins
    },
  },
});
