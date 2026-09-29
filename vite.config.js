import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
	server: {
		fs: {
			allow: [path.resolve(__dirname, 'dynamic')]
		},
		proxy: {
			'/ws': {
				target: 'ws://127.0.0.1:3015',
				ws: true
			}
		}
	},
	resolve: {
		alias: {
			$dynamic: path.resolve(__dirname, 'dynamic')
		}
	},
	plugins: [sveltekit()]
});