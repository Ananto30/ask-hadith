import { fetchSearch, preferredApiVersion } from '../store';

export async function load({ fetch, url }) {
	const searchKey = url.searchParams.get('search');
	const requestedVersion = preferredApiVersion(url.search);
	let fellBackToV1 = false;

	if (!searchKey) {
		return {
			resp: {},
			searchKey,
			fellBackToV1
		};
	}

	try {
		// SSR can't read localStorage, so the version travels in the URL (?v=v1)
		const res = await fetchSearch(fetch, searchKey, requestedVersion, () => {
			fellBackToV1 = true;
		});

		if (res.ok) {
			return {
				resp: (await res.json()) || {},
				searchKey,
				fellBackToV1
			};
		}
	} catch {
		// Keep SSR responses usable when both search services are unavailable.
	}

	return {
		resp: {},
		searchKey,
		fellBackToV1
	};
}
