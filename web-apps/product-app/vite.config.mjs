import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import checker from 'vite-plugin-checker';

export default defineConfig({
    base: '/product/',
    plugins: [
        react(),
        checker({ typescript: true })
    ],
    build: {
        outDir: 'build',
        sourcemap: false
    },
    server: {
        port: 4300,
    }
});