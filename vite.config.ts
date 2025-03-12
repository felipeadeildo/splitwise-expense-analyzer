// vite.config.ts
import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react-swc"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://secure.splitwise.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api/v3.0'),
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            // Usar um cabeçalho personalizado
            if (req.headers['x-splitwise-cookie']) {
              proxyReq.setHeader('Cookie', `user_credentials=${req.headers['x-splitwise-cookie']}`);
            }
          });
        },
      },
    },
  }
})