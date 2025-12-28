import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      onwarn(warning, warn) {
        if (
          warning.code === "CHUNK_SIZE_LIMIT" ||
          warning.code === "MODULE_LEVEL_DIRECTIVE"
        ) {
          return;
        }
        warn(warning);
      },
    },
  },
});
