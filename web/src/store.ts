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

// URL param wins so shared v1 links stay v1; localStorage keeps the user's choice
const initialVersion = (): ApiVersion => {
    if (typeof window === 'undefined') return 'v2';
    const v = new URLSearchParams(location.search).get('v') ?? localStorage.getItem('apiVersion');
    return v === 'v1' ? 'v1' : 'v2';
};

export const apiVersion = writable<ApiVersion>(initialVersion());

// Theme store - 'light', 'dark', or 'system'
export const theme = writable<'light' | 'dark' | 'system'>('system');
