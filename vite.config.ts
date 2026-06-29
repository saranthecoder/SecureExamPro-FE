import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("recharts")) {
              return "recharts";
            }
            if (id.includes("xlsx")) {
              return "xlsx";
            }
            if (id.includes("@monaco-editor")) {
              return "monaco";
            }
            if (id.includes("sweetalert2")) {
              return "sweetalert2";
            }
            if (id.includes("lucide-react")) {
              return "icons";
            }
            if (
              id.includes("@radix-ui") ||
              id.includes("class-variance-authority") ||
              id.includes("clsx") ||
              id.includes("tailwind-merge")
            ) {
              return "radix";
            }
            return "vendor";
          }
        },
      },
    },
  },
}));
