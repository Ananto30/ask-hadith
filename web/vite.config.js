import { sveltekit } from '@sveltejs/kit/vite';

import fs from 'fs';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit(), rawFonts(['.ttf'])]
};

/**
 * @param {string[]} ext
 * @returns {import('vite').Plugin}
 */
function rawFonts(ext) {
	return {
		name: 'vite-plugin-raw-fonts',
		/**
		 * @param {string} _code
		 * @param {string} id
		 */
		transform(_code, id) {
			if (ext.some((e) => id.endsWith(e))) {
				const buffer = fs.readFileSync(id);
				return { code: `export default ${JSON.stringify(buffer)}`, map: null };
			}
		}
	};
}

export default config;
