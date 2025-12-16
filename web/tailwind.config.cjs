/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			fontSize: {
				xs: ['0.75rem', { lineHeight: '1rem' }],
				sm: ['0.875rem', { lineHeight: '1.25rem' }],
				base: ['1rem', { lineHeight: '1.5rem' }],
				lg: ['1.125rem', { lineHeight: '1.75rem' }],
				xl: ['1.25rem', { lineHeight: '1.75rem' }],
				'2xl': ['1.5rem', { lineHeight: '2rem' }],
				'3xl': ['1.875rem', { lineHeight: '2.25rem' }],
				'4xl': ['2.25rem', { lineHeight: '2.5rem' }],
				'5xl': ['3rem', { lineHeight: '1' }],
				'6xl': ['3.75rem', { lineHeight: '1' }],
				'7xl': ['4.5rem', { lineHeight: '1' }],
				'8xl': ['6rem', { lineHeight: '1' }],
				'9xl': ['8rem', { lineHeight: '1' }]
			},
			spacing: {
				0: '0px',
				1: '0.25rem',
				2: '0.5rem',
				3: '0.75rem',
				4: '1rem',
				5: '1.25rem',
				6: '1.5rem',
				7: '1.75rem',
				8: '2rem',
				9: '2.25rem',
				10: '2.5rem',
				12: '3rem',
				14: '3.5rem',
				16: '4rem',
				20: '5rem',
				24: '6rem',
				28: '7rem',
				32: '8rem',
				36: '9rem',
				40: '10rem',
				44: '11rem',
				48: '12rem',
				52: '13rem',
				56: '14rem',
				60: '15rem',
				64: '16rem',
				72: '18rem',
				80: '20rem',
				96: '24rem'
			},
			fontFamily: {
				sans: [
					'"Geist"',
					'-apple-system',
					'BlinkMacSystemFont',
					'"Segoe UI"',
					'Roboto',
					'"Helvetica Neue"',
					'Arial',
					'"Noto Sans"',
					'sans-serif'
				],
				serif: ['Georgia', '"Times New Roman"', 'serif'],
				mono: ['"Fira Code"', '"Courier New"', 'monospace']
			},
			borderRadius: {
				none: '0',
				sm: '0.125rem',
				base: '0.25rem',
				md: '0.375rem',
				lg: '0.5rem',
				xl: '0.75rem',
				'2xl': '1rem',
				'3xl': '1.5rem',
				full: '9999px'
			},
			boxShadow: {
				none: 'none',
				sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
				base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
				md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
				lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
				xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
				'2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
				inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)'
			}
		}
	},
	plugins: [],
	darkMode: 'class'
};
