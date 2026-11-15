import { error } from '@sveltejs/kit';
import { COLLECTIONS, cacheHeaders, getJson } from '#lib/site.ts';
import type { PageLoad } from './$types';

type Book = { book_no: string; book_en: string; count: number };

export const load: PageLoad = async ({ fetch, params, setHeaders }) => {
	const col = COLLECTIONS.find((c) => c.id === params.collection);
	if (!col) error(404, 'Collection not found');

	const data = await getJson<{ collection: string; books: Book[] }>(fetch, '/api/browse', {
		collection_id: params.collection
	});
	setHeaders(cacheHeaders);
	return { id: col.id, collection: data.collection || col.name, books: data.books };
};
