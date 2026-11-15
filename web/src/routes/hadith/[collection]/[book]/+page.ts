import { COLLECTIONS, cacheHeaders, getJson } from '#lib/site.ts';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

type Snippet = {
	book_ref_no: string;
	hadith_no: string;
	narrator_en: string;
	snippet: string;
	chapter_en: string;
};

export const load: PageLoad = async ({ fetch, params, setHeaders }) => {
	if (!COLLECTIONS.some((c) => c.id === params.collection)) error(404, 'Collection not found');

	const data = await getJson<{
		collection: string;
		book_no: string;
		book_en: string;
		hadiths: Snippet[];
	}>(fetch, '/api/browse', { collection_id: params.collection, book: params.book });
	setHeaders(cacheHeaders);
	return { id: params.collection, ...data };
};
