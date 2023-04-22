import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import NotoSans from '$lib/NotoSans-Regular.ttf';
import { html as toReactNode } from 'satori-html';
import HadithCard from '$lib/HadithCard.svelte';

const height = 630;
const width = 1200;

export const GET = async ({ url }) => {
	const base64Hadith = url.searchParams.get('hadith') ?? '';
	const jsonHadith = Buffer.from(base64Hadith, 'base64').toString('utf-8');
	const parsed = JSON.parse(jsonHadith);

	const result = HadithCard.render({ hadith: parsed });
	const element = toReactNode(`${result.html}<style>${result.css.code}</style>`);

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

	return new Response(image.asPng(), {
		headers: {
			'content-type': 'image/png'
		}
	});
};
