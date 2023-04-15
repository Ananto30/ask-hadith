<script lang="ts">
	import { fade } from 'svelte/transition';
	import { searchKey, hadithsByCollection, selectedCollection, collectionsSorted } from '../store';
	import SearchBox from '$lib/SearchBox.svelte';
	import Hadiths from '$lib/Hadiths.svelte';
	import HadithFilters from '$lib/HadithFilters.svelte';
	import type { SearchResponse } from '../models';

	export let data: { resp: SearchResponse[] };

	let notFound = false;
	let searching = false;

	$: if (data.resp && data.resp.length > 0 && $selectedCollection == '') {
		data.resp.forEach((col: SearchResponse) => {
			$hadithsByCollection.set(col.collection, col.hadiths);
			$collectionsSorted.push({ collection: col.collection, count: col.count });
		});
		$selectedCollection = data.resp[0].collection;
		$searchKey = data.searchKey || '';
	}

	const shortDescription = () => {
		return (
			'Read ' +
			$collectionsSorted.reduce((acc, curr) => acc + curr.count, 0) +
			' hadiths about ' +
			$searchKey +
			' from ' +
			$collectionsSorted.map((col) => col.collection).join(', ')
		);
	};
</script>

<svelte:head>
	<title>Ask Hadith: {$searchKey}</title>
	<meta name="description" content={shortDescription()} />

	<meta property="og:title" content="Ask Hadith: {$searchKey}" />
	<meta property="og:description" content={shortDescription()} />
</svelte:head>

<div in:fade class="max-w-4xl mx-auto">
	<div class="top-0 z-10 my-12 md:sticky md:p-4">
		<div class="flex mx-auto">
			<SearchBox bind:searching bind:notFound />
		</div>
	</div>
	{#if searching}
		<p class="flex items-center justify-center mt-10 mb-20 animate-pulse">Searching...</p>
	{:else if notFound}
		<p class="flex items-center justify-center mt-10 mb-20 text-red-500">Nothing found! ☹️</p>
	{:else}
		<HadithFilters />
		<Hadiths />
	{/if}
</div>
