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
        port: 7706,
        proxy: {
            '/api': {
                target: 'https://www.cloud77.top',
                changeOrigin: true,
            },
            '/canteen-ws': {
                target: 'wss://www.cloud77.top',
                changeOrigin: true,
                ws: true,
            },
        }
    }
});