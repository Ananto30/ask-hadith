import Geist from '@fontsource/geist/files/geist-latin-400-normal.woff';
import GeistSemibold from '@fontsource/geist/files/geist-latin-600-normal.woff';
import Literata from '@fontsource/literata/files/literata-latin-400-normal.woff';

const height = 630;
const width = 1200;
let satori;
let Resvg;

export const GET = async ({ url }) => {
	const base64Hadith = url.searchParams.get('hadith') ?? '';
	const base64 = base64Hadith.replaceAll('-', '+').replaceAll('_', '/');
	const jsonHadith = new TextDecoder().decode(
		Uint8Array.from(atob(base64), (character) => character.charCodeAt(0))
	);
	const parsed = JSON.parse(jsonHadith);
	/** @param {unknown} value */
	const text = (value) => String(value || '').replaceAll('ﷺ', 'PBUH');
	const element = {
		type: 'div',
		props: {
			style: {
				display: 'flex',
				flexDirection: 'column',
				height: '100%',
				justifyContent: 'center',
				padding: 32,
				fontFamily: 'Geist'
			},
			children: [
				parsed.narrator_en && {
					type: 'div',
					props: {
						style: { display: 'flex', color: '#4b5563', paddingBottom: 32 },
						children: text(parsed.narrator_en)
					}
				},
				{
					type: 'div',
					props: {
						style: {
							display: 'flex',
							fontFamily: 'Literata',
							fontSize: 24,
							fontWeight: 400,
							textAlign: 'center'
						},
						children: text(parsed.body_en) || 'English translation is not available.'
					}
				},
				{
					type: 'div',
					props: {
						style: { display: 'flex', color: '#374151', fontWeight: 600, paddingTop: 32 },
						children: `${parsed.collection} Book: ${parsed.book_no}, Hadith: ${parsed.book_ref_no} (Hadith No: ${parsed.hadith_no ?? 'Unknown'})`
					}
				}
			].filter(Boolean)
		}
	};

	satori ??= (await import('@cf-wasm/satori/workerd')).default;
	const svg = await satori(element, {
		fonts: [
			{
				name: 'Geist',
				data: Geist.buffer,
				weight: 400,
				style: 'normal'
			},
			{
				name: 'Geist',
				data: GeistSemibold.buffer,
				weight: 600,
				style: 'normal'
			},
			{
				name: 'Literata',
				data: Literata.buffer,
				weight: 400,
				style: 'normal'
			}
		],
		height,
		width
	});

	Resvg ??= (await import('@cf-wasm/resvg/workerd')).Resvg;
	const resvg = await Resvg.async(svg, {
		fitTo: {
			mode: 'width',
			value: width
		}
	});

	const image = resvg.render();
	const png = new Uint8Array(image.asPng());

	return new Response(png, {
		headers: {
			'content-type': 'image/png',
			// The hadith is encoded in the URL, so the same URL always yields the same image.
			'cache-control': 'public, max-age=31536000, s-maxage=31536000, immutable'
		}
	});
};
