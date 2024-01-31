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
			},
			fontSize: {
				reading: '1.05rem'
			}
		},
		fontFamily: {
			sans: ['Merriweather Sans', 'sans-serif'],
			serif: ['Merriweather', 'serif']
		},
		fontSize: {
			xs: ['10px', '12px'],
			sm: ['12px', '16px'],
			base: ['14px', '20px'],
			lg: ['16px', '24px'],
			xl: ['18px', '28px'],
			'2xl': ['20px', '32px'],
			'3xl': ['24px', '36px'],
			'4xl': ['30px', '42px'],
			'5xl': ['36px', '48px'],
			'6xl': ['48px', '56px'],
			'7xl': ['64px', '72px'],
			'8xl': ['72px', '80px'],
			'9xl': ['96px', '104px']
		}
	},
	plugins: [],
	darkMode: 'media'
};
