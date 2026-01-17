import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: "esnext",
    minify: "esbuild",
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // React core
          if (id.includes("node_modules/react") || id.includes("node_modules/react-dom")) {
            return "vendor-react";
          }
          // React router
          if (id.includes("node_modules/react-router-dom")) {
            return "vendor-router";
          }
          // Framer motion
          if (id.includes("node_modules/framer-motion")) {
            return "vendor-framer";
          }
          // Radix UI
          if (id.includes("node_modules/@radix-ui")) {
            return "vendor-radix";
          }
          // Other utilities
          if (id.includes("node_modules")) {
            return "vendor-utils";
          }
        },
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split(".");
          let extType = info?.[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico|webp/i.test(extType || "")) {
            extType = "img";
          } else if (/woff|woff2|eot|ttf|otf/i.test(extType || "")) {
            extType = "fonts";
          }
          return `assets/${extType}/[name]-[hash][extname]`;
        },
        chunkFileNames: "assets/js/[name]-[hash].js",
        entryFileNames: "assets/js/[name]-[hash].js",
      },
    },
    reportCompressedSize: false,
    chunkSizeWarningLimit: 1000,
    sourcemap: mode === "development",
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom", "framer-motion"],
  },
}));
