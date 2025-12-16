<script lang="ts">
	import {
		searchKey,
		hadithsByCollection,
		selectedCollection,
		collectionsSorted,
		firstHadithBase64
	} from '../store';
	import SearchSvg from './svgs/search.svelte';
	import type { SearchResponse } from '../models';
	import { slide } from 'svelte/transition';

	export let searching: boolean;
	export let notFound: boolean;

	const searchHadiths = async () => {
		if ($searchKey.length < 2) {
			return;
		}
		searching = true;
		notFound = false;

		$hadithsByCollection = new Map();
		$collectionsSorted = [];

		try {
			const response = await fetch(`https://ask-hadith.vercel.app/api/search?search=${$searchKey}`);
			// const response = await fetch(`http://localhost:3000/api/search?search=${$searchKey}`);

			const resp: SearchResponse = await response.json();
			if (resp == null || resp.data.length == 0) {
				notFound = true;
				searching = false;
				return;
			}
			const collections = resp.data;
			$firstHadithBase64 = resp.first_hadith_base64;

			collections.forEach((col) => {
				$hadithsByCollection.set(col.collection, col.hadiths);
				$collectionsSorted = [
					...$collectionsSorted,
					{ collection: col.collection, count: col.count }
				];
			});

			$selectedCollection = collections[0].collection;
		} catch (error) {
			console.log(error);
			notFound = true;
		}

		window.history.pushState({}, '', `?search=${$searchKey}`);
		searching = false;
	};

	const handleKeyup = (e: { keyCode: number; preventDefault: () => void }) => {
		if (e.keyCode == 13) {
			const current = document.activeElement;
			if (current instanceof HTMLElement) current.blur();
			e.preventDefault();
			searchHadiths();
		}
	};
	let showInstructions = false;
</script>

<div class="flex flex-col items-center justify-center gap-4">
	<div class="w-full max-w-2xl px-4">
		<div
			class="flex w-full overflow-hidden rounded-lg border border-neutral-300 bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-800"
		>
			<input
				type="text"
				class="flex-1 border-0 bg-transparent px-4 py-3 text-base placeholder-neutral-500 focus:outline-none dark:text-neutral-50"
				placeholder="Search: Qadr, Bukhari 1029, Muslim 1763..."
				bind:value={$searchKey}
				on:keyup={handleKeyup}
			/>
			<button
				class="border-l border-neutral-300 px-4 py-3 text-neutral-600 transition-colors hover:bg-neutral-50 hover:text-neutral-900 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:hover:text-neutral-50"
				on:click={searchHadiths}
				aria-label="Search Hadiths"
			>
				<SearchSvg />
			</button>
		</div>
	</div>

	<div class="flex w-full max-w-2xl flex-col items-center gap-3 px-4">
		<button
			class="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-700"
			on:click={() => (showInstructions = !showInstructions)}
		>
			<span>{showInstructions ? 'Hide' : 'Show'} Search Tips</span>
			<svg
				class="h-4 w-4 transition-transform duration-200"
				class:rotate-180={showInstructions}
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"
				></path>
			</svg>
		</button>
		{#if showInstructions}
			<ul
				transition:slide
				class="flex w-full flex-col gap-2 rounded-lg border border-neutral-200 bg-neutral-50 p-4 text-sm dark:border-neutral-700 dark:bg-neutral-800"
			>
				<li class="flex gap-2 text-neutral-700 dark:text-neutral-300">
					<span class="text-neutral-500">•</span>
					<span>Search is based on exact match of words.</span>
				</li>
				<li class="flex gap-2 text-neutral-700 dark:text-neutral-300">
					<span class="text-neutral-500">•</span>
					<span>Multiple words like "cat water" show results containing all words.</span>
				</li>
				<li class="flex gap-2 text-neutral-700 dark:text-neutral-300">
					<span class="text-neutral-500">•</span>
					<span>Search specific hadith: "bukhari 1028", "muslim 3", etc.</span>
				</li>
			</ul>
		{/if}
	</div>
</div>
