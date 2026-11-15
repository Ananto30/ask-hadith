import { error, redirect } from '@sveltejs/kit';
import { hadithPath } from '#lib/site.ts';

// Old query-string URLs are already shared and indexed; 301 them to the clean path.
export const GET = ({ url }) => {
	const c = url.searchParams.get('collection_id');
	const b = url.searchParams.get('book');
	const r = url.searchParams.get('ref_no');
	if (!c || !b || !r || ![c, b, r].every((v) => /^[a-z0-9]+$/.test(v))) {
		error(404, 'Hadith not found');
	}

	const key = url.searchParams.get('search_key');
	redirect(301, hadithPath(c, b, r) + (key ? `?search_key=${encodeURIComponent(key)}` : ''));
};
