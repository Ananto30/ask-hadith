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
		$collectionsSorted = new Array();

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

<div class="flex-col items-center justify-center mx-auto">
	<div class="flex w-full border-b border-gray-500 md:w-96">
		<input
			type="text"
			class="w-full px-4 py-2 text-sm md:w-96 focus:outline-none"
			placeholder="Qadr, bukhari 1029, muslim 1763 etc..."
			bind:value={$searchKey}
			on:keyup={handleKeyup}
		/>
		<button
			class="flex items-center justify-center px-4"
			on:click={searchHadiths}
			aria-label="Search Hadiths"
		>
			<SearchSvg />
		</button>
	</div>
	<!-- <div class="flex-col text-xs mt-3 text-gray-400 text-center">
		To search specific hadith use like this -
		<br />
		bukhari 1028, muslim 3, etc.
	</div> -->
</div>
