import type { RequestEvent } from '@sveltejs/kit/types/internal';

export async function load({ url }: RequestEvent) {
	const collectionId = url.searchParams.get('collection_id');
	const book = url.searchParams.get('book');
	const refNumber = url.searchParams.get('ref_no');

	if (!collectionId || !book || !refNumber) {
		return {
			hadith: null
		};
	}

	const res = await fetch(
		`https://ask-hadith.vercel.app/api/book?collection_id=${collectionId}&book=${book}&ref_no=${refNumber}`
	);

	if (res.ok) {
		const data = await res.json();
		return {
			hadith: data
		};
	}
}
