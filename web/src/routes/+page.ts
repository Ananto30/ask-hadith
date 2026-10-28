import { searchUrl } from '../store';

export async function load({ fetch, url }) {
	const searchKey = url.searchParams.get('search');
	if (!searchKey) {
		return {
			resp: {},
			searchKey
		};
	}
	// SSR can't read localStorage, so the version travels in the URL (?v=v1)
	const res = await fetch(searchUrl(searchKey, url.searchParams.get('v') === 'v1' ? 'v1' : 'v2'));

	if (res.ok) {
		const data = await res.json();
		return {
			resp: data || {},
			searchKey
		};
	}
}
