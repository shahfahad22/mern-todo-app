import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/",  // production me root path
  build: {
    outDir: "dist", // Vercel default output folder
  },
});
