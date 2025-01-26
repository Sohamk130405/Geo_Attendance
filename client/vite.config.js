import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    https: {
      key: "./geo_attendance-privateKey.key",
      cert: "./geo_attendance.crt",
    },
  },
  plugins: [react()],
});
