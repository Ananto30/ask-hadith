import type { RequestEvent } from '@sveltejs/kit/types/internal';

export async function load({ url }: RequestEvent) {
	const searchKey = url.searchParams.get('search');
	if (!searchKey) {
		return {
			hadiths: []
		};
	}
	const res = await fetch(`https://ask-hadith.vercel.app/api/search?search=${searchKey}`);

	if (res.ok) {
		const data = await res.json();
		return {
			hadiths: data
		};
	}
}
