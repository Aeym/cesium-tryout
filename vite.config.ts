import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from "vite";
import { resolve } from "path";
import { viteStaticCopy } from "vite-plugin-static-copy";
import vue from "@vitejs/plugin-vue";

const cesiumSource = 'node_modules/cesium/Build/Cesium';

export default defineConfig({
	define: {
		CESIUM_BASE_URL: JSON.stringify("/static/Cesium/"),
	},
	plugins: [
		vue(),
		viteStaticCopy({
			targets: [
				{ src: resolve(cesiumSource, "Assets"), dest: "static/Cesium" },
				{ src: resolve(cesiumSource, "ThirdParty"), dest: "static/Cesium" },
				{ src: resolve(cesiumSource, "Widgets"), dest: "static/Cesium" },
				{ src: resolve(cesiumSource, "Workers"), dest: "static/Cesium" },
			],
		}),
	],
	resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        }
    },
});
