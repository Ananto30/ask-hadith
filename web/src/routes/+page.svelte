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

	const shortDescription = () => {
		return (
			'Read ' +
			$collectionsSorted.reduce((acc, curr) => acc + curr.count, 0) +
			" hadiths about '" +
			$searchKey +
			"' from " +
			$collectionsSorted.map((col) => col.collection).join(', ')
		);
	};

	const title = () => {
		return "Hadiths about '" + $searchKey + "'";
	};
</script>

<svelte:head>
	<title>{title()}</title>
	<meta name="description" content={shortDescription()} />

	<!-- Facebook Meta Tags -->
	<meta property="og:url" content="https://www.askhadith.com/?search={$searchKey}" />
	<meta property="og:type" content="website" />
	<meta property="og:title" content={title()} />
	<meta property="og:description" content={shortDescription()} />
	{#if $firstHadithBase64}
		<meta
			property="og:image"
			content="https://www.askhadith.com/api/og?hadith={$firstHadithBase64}"
		/>
	{/if}

	<!-- Twitter Meta Tags -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta property="twitter:domain" content="askhadith.com" />
	<meta property="twitter:url" content="https://www.askhadith.com/?search={$searchKey}" />
	<meta name="twitter:title" content={title()} />
	<meta name="twitter:description" content={shortDescription()} />
	{#if $firstHadithBase64}
		<meta
			name="twitter:image"
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
