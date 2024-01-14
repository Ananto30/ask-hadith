/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				storm: {
					50: '#f5f5f5',
					100: '#ebebeb',
					200: '#c8c8c8',
					300: '#a5a5a5',
					400: '#5f5f5f',
					500: '#191919',
					600: '#171717',
					700: '#141414',
					800: '#111111',
					900: '#0d0d0d'
				}
			}
		},
		fontFamily: {
			sans: [
				'Open Sans',
				'Work Sans',
				'Rubik',
				'Inter',
				'PT Sans',
				'Lato',
				'Nunito',
				'Poppins',
				'Varela Round',
				'Fira Sans',
				'Roboto Slab',
				'sans-serif'
			],
			serif: [
				'Bitter',
				'Domine',
				'PT Serif',
				'Lora',
				'Vollkorn',
				'Merriweather',
				'Poppins',
				'serif'
			]
		}
	},
	plugins: [],
	darkMode: 'media'
};
