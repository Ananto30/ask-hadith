const ORIGIN = 'https://www.askhadith.com';

type Ref = { collection_id: string; book_no: string; book_ref_no: string };

export const GET = async ({ fetch }) => {
	const res = await fetch('https://ask-hadith.vercel.app/api/refs');
	if (!res.ok) return new Response('sitemap unavailable', { status: 502 });
	const refs: Ref[] = await res.json();

	// ~35k hadiths fits one file (limit is 50k URLs); split into an index if the corpus grows.
	const urls = refs.map(
		(r) =>
			`<url><loc>${ORIGIN}/book?collection_id=${encodeURIComponent(r.collection_id)}&amp;book=${encodeURIComponent(r.book_no)}&amp;ref_no=${encodeURIComponent(r.book_ref_no)}</loc></url>`
	);

	return new Response(
		`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${ORIGIN}/</loc></url>${urls.join('')}</urlset>`,
		{
			headers: {
				'Content-Type': 'application/xml',
				'Cache-Control': 'public, s-maxage=86400'
			}
		}
	);
};
