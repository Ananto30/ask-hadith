import { writable } from 'svelte/store';
import type { CollectionCounter, HadithModel } from './models';

export const hadiths = writable<HadithModel[]>([]);
export const filteredHadiths = writable<HadithModel[]>([]);
export const searchKey = writable<string>('');

export const collectionsSorted = writable<CollectionCounter[]>([]);
export const hadithsByCollection = writable<Map<string, HadithModel[]>>(new Map());
export const selectedCollection = writable<string>('');
