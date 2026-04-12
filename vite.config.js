import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
	server: {
		fs: {
			allow: [path.resolve(__dirname, 'dynamic')]
		}
	},
	resolve: {
		alias: {
			$dynamic: path.resolve(__dirname, 'dynamic')
		}
	},
	plugins: [sveltekit()]
});