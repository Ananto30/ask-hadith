<script lang="ts">
	import { fade } from 'svelte/transition';
	import {
		searchKey,
		hadithsByCollection,
		selectedCollection,
		collectionsSorted,
		firstHadithBase64
	} from '../store';
	import SearchBox from '$lib/SearchBox.svelte';
	import HadithList from '$lib/HadithList.svelte';
	import HadithFilters from '$lib/HadithFilters.svelte';
	import type { SearchResponse } from '../models';

	export let data: { resp: SearchResponse; searchKey: string };

	let notFound = false;
	let searching = false;

	$: if (data && data.resp && data.resp.data.length > 0 && $selectedCollection == '') {
		data.resp.data.forEach((col) => {
			$hadithsByCollection.set(col.collection, col.hadiths);
			$collectionsSorted.push({ collection: col.collection, count: col.count });
		});
		$selectedCollection = data.resp.data[0].collection;
		$searchKey = data.searchKey || '';
		$firstHadithBase64 = data.resp.first_hadith_base64;
	}

	const shortDescription = () => {
		return (
			'Read ' +
			$collectionsSorted.reduce((acc, curr) => acc + curr.count, 0) +
			' hadiths about "' +
			$searchKey +
			'" from ' +
			$collectionsSorted.map((col) => col.collection).join(', ')
		);
	};
</script>

<svelte:head>
	<title>Ask Hadith: {$searchKey}</title>
	<meta name="description" content={shortDescription()} />

	<meta property="og:site_name" content="Ask Hadith" />
	<meta property="og:locale" content="en" />
	<meta property="og:title" content="Hadiths about '{$searchKey}'" />
	<meta property="og:description" content={shortDescription()} />
	{#if $firstHadithBase64}
		<meta
			property="og:image"
			content="https://www.askhadith.com/api/og?hadith={$firstHadithBase64}"
		/>
	{/if}
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
		<HadithList />
	{/if}
</div>
