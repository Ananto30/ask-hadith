import { error } from '@sveltejs/kit';
import { BOOK_API, COLLECTIONS, ORIGIN, hadithPath } from '#lib/site.ts';

type Ref = { collection_id: string; book_no: string; book_ref_no: string };

const xml = (paths: string[]) =>
	new Response(
		`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths
			.map((p) => `<url><loc>${ORIGIN}${p}</loc></url>`)
			.join('')}</urlset>`,
		{
			headers: {
				'Content-Type': 'application/xml',
				'Cache-Control': 'public, s-maxage=86400'
			}
		}
	);

export const GET = async ({ fetch, params }) => {
	if (params.name === 'main') return xml(['/', '/hadith']);
	if (!COLLECTIONS.some((c) => c.id === params.name)) error(404, 'Not found');

	const res = await fetch(`${BOOK_API}/api/refs?collection_id=${params.name}`);
	if (!res.ok) error(502, 'sitemap unavailable');
	const refs: Ref[] = await res.json();

	// Ref numbers are digits only (validated by the API), so paths need no XML escaping.
	const books = [...new Set(refs.map((r) => r.book_no))];
	return xml([
		`/hadith/${params.name}`,
		...books.map((b) => `/hadith/${params.name}/${b}`),
		...refs.map((r) => hadithPath(r.collection_id, r.book_no, r.book_ref_no))
	]);
};
