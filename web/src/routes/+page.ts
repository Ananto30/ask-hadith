import type { RequestEvent } from '@sveltejs/kit/types/internal';

export async function load({ url }: RequestEvent) {
	const searchKey = url.searchParams.get('search');
	if (!searchKey) {
		return {
			resp: [],
			searchKey
		};
	}
	const res = await fetch(`https://ask-hadith.vercel.app/api/search?search=${searchKey}`);
	// const res = await fetch(`http://localhost:3000/api/search?search=${searchKey}`);

	if (res.ok) {
		const data = await res.json();
		return {
			resp: data || [],
			searchKey
		};
	}
}
