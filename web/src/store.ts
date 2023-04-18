import { writable } from 'svelte/store';
import type { CollectionCounter, HadithModel } from './models';

export const searchKey = writable<string>('');
export const selectedCollection = writable<string>('');

export const collectionsSorted = writable<CollectionCounter[]>([]);
export const hadithsByCollection = writable<Map<string, HadithModel[]>>(new Map());
