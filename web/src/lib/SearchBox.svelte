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
</script>

<div class="space-y-3">
	<div
		class="border-line bg-paper focus-within:border-ink flex h-12 items-center rounded-lg border transition-colors"
	>
		<input
			type="search"
			enterkeyhint="search"
			class="placeholder:text-muted h-full min-w-0 flex-1 bg-transparent pl-4 text-base outline-none [&::-webkit-search-cancel-button]:hidden"
			placeholder="Search: Qadr, Bukhari 1029, Muslim 1763..."
			aria-label="Search hadiths"
			bind:value={$searchKey}
			on:keyup={handleKeyup}
		/>
		<button
			class="text-ink-2 hover:text-ink flex h-full cursor-pointer items-center px-4"
			on:click={searchHadiths}
			aria-label="Search Hadiths"
		>
			<SearchSvg />
		</button>
	</div>

	<details class="group text-muted text-sm">
		<summary
			class="hover:text-ink w-fit cursor-pointer list-none select-none [&::-webkit-details-marker]:hidden"
		>
			<span class="underline decoration-dotted underline-offset-4">Search tips</span>
		</summary>
		<ul class="text-ink-2 marker:text-muted mt-3 list-disc space-y-1.5 pl-5 leading-relaxed">
			<li>Search is based on exact match of words.</li>
			<li>Multiple words like "cat water" show results containing all words.</li>
			<li>Search specific hadith: "bukhari 1028", "muslim 3", etc.</li>
		</ul>
	</details>
</div>
