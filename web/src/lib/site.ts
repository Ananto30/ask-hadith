import { error } from '@sveltejs/kit';

export const ORIGIN = 'https://www.askhadith.com';
export const BOOK_API =
	(import.meta.env.VITE_BOOK_API as string | undefined)?.replace(/\/$/, '') ||
	'https://ask-hadith.vercel.app';

export const COLLECTIONS = [
	{ id: 'bukhari', name: 'Sahih al-Bukhari' },
	{ id: 'muslim', name: 'Sahih Muslim' },
	{ id: 'abudawud', name: 'Sunan Abi Dawud' },
	{ id: 'tirmidhi', name: 'Jami` at-Tirmidhi' },
	{ id: 'nasai', name: "Sunan an-Nasa'i" },
	{ id: 'ibnmajah', name: 'Sunan Ibn Majah' }
];

export const hadithPath = (collection: string, book: string, ref: string) =>
	`/hadith/${collection}/${book}/${ref}`;

export const clip = (s: string, n: number) =>
	s.length > n
		? s.slice(0, Math.max(s.lastIndexOf(' ', n), 0) || n).replace(/[\s,;:.]+$/, '') + '…'
		: s;

// The corpus changes when a scrape is imported. Keep edge caching useful, but
// short enough that a data update propagates without a manual cache purge.
// Netlify uses its vendor-specific header; other CDNs use Cache-Control.
export const cacheHeaders = {
	'Cache-Control': 'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400',
	'Netlify-CDN-Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
};

// 400/404 mean "no such page"; anything else is an upstream failure crawlers should retry.
export async function getJson<T>(
	fetch: typeof globalThis.fetch,
	path: string,
	params: Record<string, string>
): Promise<T> {
	const res = await fetch(`${BOOK_API}${path}?${new URLSearchParams(params)}`);
	if (!res.ok) error(res.status === 400 || res.status === 404 ? 404 : 502, 'Not found');
	return res.json();
}
