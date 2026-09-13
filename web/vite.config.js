import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';

import fs from 'node:fs';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [tailwindcss(), sveltekit(), rawFonts(['.ttf'])]
};

/** @param {string[]} ext */
function rawFonts(ext) {
	return {
		name: 'vite-plugin-raw-fonts',
		transform(/** @type {string} */ code, /** @type {string} */ id) {
			if (ext.some((e) => id.endsWith(e))) {
				const buffer = fs.readFileSync(id);
				return { code: `export default ${JSON.stringify(buffer)}`, map: null };
			}
		}
	};
}

export default config;
