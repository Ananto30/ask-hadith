<script lang="ts">
	import HadithFilters from '#lib/HadithFilters.svelte';
	import HadithList from '#lib/HadithList.svelte';
	import SearchBox from '#lib/SearchBox.svelte';
	import { fade } from 'svelte/transition';
	import type { SearchResponse } from '../models';
	import {
		apiVersion,
		collectionsSorted,
		firstHadithBase64,
		hadithsByCollection,
		searchKey,
		selectedCollection
	} from '../store';

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

<div in:fade class="mx-auto max-w-3xl px-5 sm:px-8">
	{#if !searching && !notFound && $collectionsSorted.length === 0}
		<header class="pt-16 pb-8 sm:pt-24">
			<h1 class="font-serif text-4xl font-medium tracking-[-0.02em] text-balance sm:text-5xl">
				Search the hadith
			</h1>
			<p class="text-ink-2 mt-5 max-w-[52ch] leading-relaxed text-pretty">
				Sahih al-Bukhari, Sahih Muslim, Sunan Abi Dawud, Jami` at-Tirmidhi, Sunan an-Nasa'i and
				Sunan Ibn Majah.
			</p>
		</header>
	{/if}

	<div class="pt-8 pb-6">
		<SearchBox bind:searching bind:notFound />
	</div>

	{#if searching}
		<p class="text-muted flex items-center gap-3 py-16 text-sm" role="status">
			<span
				class="border-line border-t-ink h-4 w-4 animate-spin rounded-full border-2"
				aria-hidden="true"
			></span>
			Searching hadiths…
		</p>
	{:else if notFound}
		<div class="py-16" role="status">
			<p class="font-serif text-xl">No results for “{$searchKey}”</p>
			<p class="text-muted mt-2 text-sm">
				{$apiVersion === 'v2'
					? 'Try rephrasing, or use different words.'
					: 'Search matches exact words. Try fewer or different words.'}
			</p>
		</div>
	{:else}
		<HadithFilters />
		<HadithList />
	{/if}
</div>
