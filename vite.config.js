import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// SPA routing configured in vercel.json
export default defineConfig({
  plugins: [react()],
});
