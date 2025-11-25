import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import { visualizer } from 'rollup-plugin-visualizer';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    build: {
        sourcemap: false
    },
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),
        // visualizer({
        //     filename: 'bundle-stats.html', // This will create a file in your root
        //     open: true, // Automatically opens it in your browser after build
        // }),
        react(),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './resources/js'),
        },
    },
});
