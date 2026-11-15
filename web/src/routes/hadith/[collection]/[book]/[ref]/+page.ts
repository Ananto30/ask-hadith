import { COLLECTIONS, cacheHeaders, getJson } from '#lib/site.ts';
import { error } from '@sveltejs/kit';
import type { HadithModel } from '../../../../../models';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, params, url, setHeaders }) => {
	if (!COLLECTIONS.some((c) => c.id === params.collection)) error(404, 'Collection not found');

	const hadith = await getJson<HadithModel>(fetch, '/api/book', {
		collection_id: params.collection,
		book: params.book,
		ref_no: params.ref
	});
	setHeaders(cacheHeaders);
	return { hadith, searchKey: url.searchParams.get('search_key') };
};
