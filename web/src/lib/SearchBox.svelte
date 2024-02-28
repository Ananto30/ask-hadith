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

<div class="mx-auto flex-col items-center justify-center">
	<div class="flex w-full justify-center rounded-lg shadow">
		<input
			type="text"
			class="w-full rounded-l-lg rounded-r-none border border-gray-50 bg-white p-3 text-sm focus:border-gray-600 focus:outline-none dark:border-gray-800 dark:bg-gray-800 dark:text-gray-300 md:w-96"
			placeholder="Qadr, bukhari 1029, muslim 1763 etc..."
			bind:value={$searchKey}
			on:keyup={handleKeyup}
		/>
		<button
			class="flex items-center justify-center rounded-r-lg border bg-gray-200 px-4 focus:border-gray-600 focus:outline-none dark:border-gray-800 dark:bg-gray-700 dark:text-gray-300"
			on:click={searchHadiths}
			aria-label="Search Hadiths"
		>
			<SearchSvg />
		</button>
	</div>

	<div
		class="mx-auto mt-4 flex max-w-sm flex-col items-center justify-center text-xs text-gray-600 dark:text-gray-400"
	>
		<button
			class="mb-2 flex items-center rounded font-bold"
			on:click={() => (showInstructions = !showInstructions)}
		>
			{showInstructions ? 'Hide Instructions' : 'Show Instructions'}
			<svg
				class="ml-1 h-4 w-4"
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
			<ul transition:slide class="flex list-disc flex-col gap-2">
				<li>Search is based on exact match of words.</li>
				<li>
					Search for multiple words like - cat water - will show if these words are present in
					hadith.
				</li>
				<li>To search specific hadith use like this - bukhari 1028, muslim 3, etc.</li>
			</ul>
		{/if}
	</div>
</div>
