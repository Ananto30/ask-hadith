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
		$hadithsByCollection.clear();
		$collectionsSorted = [];
		$selectedCollection = '';
		$searchKey = '';
		$firstHadithBase64 = '';

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

<div in:fade class="min-h-screen">
	<!-- Search Section -->
	<div class="bg-white py-8 dark:border-neutral-800 dark:bg-neutral-900">
		<div class="mx-auto max-w-4xl px-4">
			<!-- <div class="mb-8">
				<h1
					class="mb-2 text-center text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50"
				>
					Search Hadiths
				</h1>
				<p class="text-center text-base text-neutral-600 dark:text-neutral-300">
					Explore authentic hadith collections with intelligent search
				</p>
			</div> -->
			<SearchBox bind:searching bind:notFound />
		</div>
	</div>

	<!-- Results Section -->
	<div class="bg-white dark:bg-neutral-900">
		{#if searching}
			<div class="flex justify-center py-16">
				<div class="flex flex-col items-center gap-3">
					<div
						class="h-8 w-8 animate-spin rounded-full border-4 border-neutral-300 border-t-neutral-900 dark:border-neutral-700 dark:border-t-neutral-50"
					></div>
					<p class="text-sm font-medium text-neutral-600 dark:text-neutral-300">
						Searching hadiths...
					</p>
				</div>
			</div>
		{:else if notFound}
			<div class="flex justify-center py-16">
				<div class="text-center">
					<p class="mb-4 text-5xl">🔍</p>
					<p class="mb-2 text-lg font-medium text-neutral-900 dark:text-neutral-50">
						No results found
					</p>
					<p class="text-sm text-neutral-600 dark:text-neutral-300">
						Try adjusting your search terms
					</p>
				</div>
			</div>
		{:else}
			<HadithFilters />
			<HadithList />
		{/if}
	</div>
</div>
