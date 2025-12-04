import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import checker from 'vite-plugin-checker';

export default defineConfig({
    plugins: [
        react(),
        checker({ typescript: true })
    ],
    build: {
        outDir: 'build',
        sourcemap: false
    },
    server: {
        port: 7705,
        proxy: {
            '/api': {
                target: 'http://localhost:7710',
                changeOrigin: true,
            },
            '/canteen-ws': {
                target: 'http://localhost:7715',
                changeOrigin: true,
                ws: true,
            }
        }
    }
});