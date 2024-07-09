import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from "vite-plugin-pwa"

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        proxy: {
            "/api": {
                target: "http://127.0.0.1:5000",
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, '')
            }
        }
    },
    plugins: [ react(), VitePWA({
        registerType: "autoUpdate",
        manifest: {
            name: "AgroGuard: Safeguarding crops, one leaf at a time!",
            short_name: "AgroGuard",
            display: "standalone",
            background_color: "#ffffff",
            theme_color: "#000000",
            description: "AgroGuard is a deep-learning-based application that helps us identify different diseases in plants and provides timely cures.",
            scope: ".",
            start_url: "/",
            icons: [
                {
                    src: "/icon-72x72.png",
                    sizes: "72x72",
                    type: "image/png"
                },
                {
                    src: "/icon-128x128.png",
                    sizes: "128x128",
                    type: "image/png",
                },
                {
                    src: "/icon-144x144.png",
                    sizes: "144x144",
                    type: "image/png"
                },
                {
                    src: "/icon-192x192.png",
                    sizes: "192x192",
                    type: "image/png"
                },
                {
                    src: "/icon-512x512.png",
                    sizes: "512x512",
                    type: "image/png"
                },
                {
                    src: "/icon-2000x2000.png",
                    sizes: "2000x2000",
                    type: "image/png"
                }
            ]
        }
    }) ],
    resolve: {
        alias: {
            "@": "./src",
            "@Components": "./src/Components"
        }
    }
})
