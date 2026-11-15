import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ url, fetch }) => {
	const collectionId = url.searchParams.get('collection_id');
	const book = url.searchParams.get('book');
	const refNumber = url.searchParams.get('ref_no');
	const searchKey = url.searchParams.get('search_key');

	if (!collectionId || !book || !refNumber) error(404, 'Hadith not found');

	const params = new URLSearchParams({ collection_id: collectionId, book, ref_no: refNumber });
	const res = await fetch(`https://ask-hadith.vercel.app/api/book?${params}`);

	// 400/404 mean "no such hadith"; anything else is an upstream failure crawlers should retry.
	if (!res.ok) error(res.status === 400 || res.status === 404 ? 404 : 502, 'Hadith not found');

	return { hadith: await res.json(), searchKey };
};
