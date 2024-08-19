import { defineConfig, Plugin, ConfigEnv, UserConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { IncomingMessage, ServerResponse } from 'http'
import fs from 'fs'
import path from 'path'

const customMiddleware: Plugin = {
  name: 'configure-server',
  configureServer(server) {
    server.middlewares.use((req: IncomingMessage, res: ServerResponse, next: () => void) => {
      if (req.url && req.url.endsWith('.wasm')) {
        res.setHeader('Content-Type', 'application/wasm');
      }
      next();
    });
  },
};

const handleMissingSourceMap: Plugin = {
  name: 'handle-missing-source-map',
  configureServer(server) {
    server.middlewares.use((req: IncomingMessage, res: ServerResponse, next: () => void) => {
      if (req.url && req.url.endsWith('.map')) {
        const filePath = path.join(process.cwd(), 'public', req.url);
        if (!fs.existsSync(filePath)) {
          res.statusCode = 404;
          res.end('Source map not found');
          return;
        }
      }
      next();
    });
  },
};

export default defineConfig(({ command, mode }: ConfigEnv): UserConfig => {
  return {  
    define: {
      global: 'globalThis',
    },
    optimizeDeps: {
      exclude: ['@ruffle-rs/ruffle'],
      esbuildOptions: {
        target: 'es2020',
      },
    },
    publicDir: 'public',
    plugins: [react(), customMiddleware, handleMissingSourceMap],
    server: {
      cors: true,
      fs: {
        allow: ['.']
      }
    },
    build: {
      commonjsOptions: {
        include: [/@ruffle-rs\/ruffle/, /node_modules/]
      },
      rollupOptions: {
        output: {
          manualChunks: {
            ruffle: ['@ruffle-rs/ruffle']
          }
        }
      },
      sourcemap: false // 소스 맵 생성 비활성화
    },
    resolve: {
      alias: {
        '@ruffle-rs/ruffle': '@ruffle-rs/ruffle/ruffle.js'
      }
    }
  }
})