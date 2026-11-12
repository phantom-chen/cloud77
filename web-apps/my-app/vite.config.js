import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
    plugins: [react()],
    server: {
        port: 5001,
        proxy: {
            '/api': {
                changeOrigin: true,
                target: 'http://localhost:7710'
            }
        }
    },
    preview: {
        port: 5678
    }
});