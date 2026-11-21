import { writable } from 'svelte/store';
import type { CollectionCounter, HadithModel } from './models';

export const searchKey = writable<string>('');
export const selectedCollection = writable<string>('');
export const firstHadithBase64 = writable<string>('');

export const collectionsSorted = writable<CollectionCounter[]>([]);
export const hadithsByCollection = writable<Map<string, HadithModel[]>>(new Map());

export type ApiVersion = 'v1' | 'v2';

const API_BASE: Record<ApiVersion, string> = {
	v1: 'https://ask-hadith.vercel.app',
	v2: 'https://hadith.azizul.online'
};

export const searchUrl = (key: string, v: ApiVersion) =>
	`${API_BASE[v]}/api/search?search=${encodeURIComponent(key)}`;

export const fetchSearch = async (
	fetcher: typeof fetch,
	key: string,
	version: ApiVersion,
	onFallback?: () => void
) => {
	if (version === 'v1') return fetcher(searchUrl(key, version));

	try {
		const response = await fetcher(searchUrl(key, version));
		if (response.ok) return response;
	} catch {
		// v2 availability failures fall through to v1.
	}

	onFallback?.();
	return fetcher(searchUrl(key, 'v1'));
};

// URL param wins so shared v1 links stay v1; localStorage keeps the user's choice
export const preferredApiVersion = (search: string): ApiVersion => {
	const v =
		new URLSearchParams(search).get('v') ??
		(typeof window !== 'undefined' ? localStorage.getItem('apiVersion') : null);
	return v === 'v1' ? 'v1' : 'v2';
};

export const apiVersion = writable<ApiVersion>(
	preferredApiVersion(typeof window === 'undefined' ? '' : location.search)
);

// Theme store - 'light', 'dark', or 'system'
export const theme = writable<'light' | 'dark' | 'system'>('system');
