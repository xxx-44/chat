import type { Config } from 'tailwindcss';

const config: Config = {
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
			},
			colors: {
				bgC: 'var(--bg)',
				bgCm: 'var(--bg-main)',
				bgCs: 'var(--bg-sub)',
				bgCsh: 'var(--bg-sub-hover)',
				chat1: 'var(--bg-chat-1)',
				chat2: 'var(--bg-chat-2)',
				txtCm: 'var(--txt-main)',
				txtCs: 'var(--txt-sub)',
				btnC: 'var(--btn)',
				btnCh: 'var(--btn-hover)',
			},
		},
	},
	plugins: [],
};
export default config;
