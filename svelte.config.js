import adapter from '@sveltejs/adapter-node';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';

const file = fileURLToPath(new URL('package.json', import.meta.url));
const json = readFileSync(file, 'utf8');
const pkg = JSON.parse(json);

export default {
	kit: {
		adapter: adapter(),
		version: {
			name: pkg.version,
		}
	}
};