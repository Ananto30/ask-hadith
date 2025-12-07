import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import NotoSans from '$lib/NotoSans-Regular.ttf';
import { html as toReactNode } from 'satori-html';
import HadithCard from '$lib/HadithCard.svelte';
import { render } from 'svelte/server';
import type { RequestHandler } from './$types';

const height = 630;
const width = 1200;

export const GET: RequestHandler = async ({ url }) => {
	const base64Hadith = url.searchParams.get('hadith') ?? '';
	const jsonHadith = Buffer.from(base64Hadith, 'base64').toString('utf-8');
	const parsed = JSON.parse(jsonHadith);

	const result = render(HadithCard, { props: { hadith: parsed } });
	const element = toReactNode(`${result.html}<style>${result.head ?? ''}</style>`);

	const svg = await satori(element, {
		fonts: [
			{
				name: 'Noto Sans',
				data: Buffer.from(NotoSans),
				style: 'normal'
			}
		],
		height,
		width
	});

	const resvg = new Resvg(svg, {
		fitTo: {
			mode: 'width',
			value: width
		}
	});

	const image = resvg.render();
	const png = image.asPng();

	return new Response(Uint8Array.from(png), {
		headers: {
			'content-type': 'image/png'
		}
	});
};
