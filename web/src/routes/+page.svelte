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

	$: if (data?.resp?.data?.length > 0 && $selectedCollection == '') {
		data.resp.data.forEach((col) => {
			$hadithsByCollection.set(col.collection, col.hadiths);
			$collectionsSorted.push({ collection: col.collection, count: col.count });
		});
		$selectedCollection = data.resp.data[0].collection;
		$searchKey = data.searchKey || '';
		$firstHadithBase64 = data.resp.first_hadith_base64;
	}

	const ogDescription = () => {
		if ($collectionsSorted?.length > 0)
			return (
				'Read ' +
				$collectionsSorted.reduce((acc, curr) => acc + curr.count, 0) +
				" hadiths about '" +
				$searchKey +
				"' from " +
				$collectionsSorted.map((col) => col.collection).join(', ')
			);
		return "Search anything from Hadiths (includes: Sahih al-Bukhari, Sahih Muslim, Sunan Abi Dawud, Jami` at-Tirmidhi, Sunan an-Nasa'i, Sunan Ibn Majah)";
	};

	const ogTitle = () => {
		if ($searchKey) return "Hadiths about '" + $searchKey + "'";
		return 'AskHadith.com - Search Hadiths from Sahih Bukhari, Sahih Muslim and more';
	};

	const ogImage = () => {
		if ($firstHadithBase64) return 'https://www.askhadith.com/api/og?hadith=' + $firstHadithBase64;
		return 'https://www.askhadith.com/favicon.ico';
	};
</script>

<svelte:head>
	<title>{ogTitle()}</title>
	<meta name="description" content={ogDescription()} />

	<!-- Facebook Meta Tags -->
	<meta property="og:url" content="https://www.askhadith.com/?search={$searchKey}" />
	<meta property="og:type" content="website" />
	<meta property="og:title" content={ogTitle()} />
	<meta property="og:description" content={ogDescription()} />
	<meta property="og:image" content={ogImage()} />

	<!-- Twitter Meta Tags -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta property="twitter:domain" content="askhadith.com" />
	<meta property="twitter:url" content="https://www.askhadith.com/?search={$searchKey}" />
	<meta name="twitter:title" content={ogTitle()} />
	<meta name="twitter:description" content={ogDescription()} />
	<meta name="twitter:image" content={ogImage()} />
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
