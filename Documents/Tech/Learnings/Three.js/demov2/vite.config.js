import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true
  },
  plugins: [
    nodePolyfills({
      include: ['buffer', 'process', 'util', 'crypto', 'stream', 'assert', 'http', 'https', 'os', 'url'],
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
      protocolImports: true,
    }),
  ],
  optimizeDeps: {
    include: ['three', 'gsap', '@solana/web3.js', '@solana/spl-token'],
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
  },
  resolve: {
    alias: {
      'three': 'three',
      '@': '/src',
      'buffer': 'buffer',
      'process': 'process',
      'stream': 'stream-browserify',
      'util': 'util',
      'crypto': 'crypto-browserify',
      'assert': 'assert',
      'http': 'stream-http',
      'https': 'https-browserify',
      'os': 'os-browserify',
      'url': 'url',
    }
  },
  define: {
    'process.env': {},
    global: 'globalThis',
    'window.Buffer': 'Buffer',
    'window.process': 'process',
  },
}); 