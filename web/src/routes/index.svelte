<script context="module">
	export async function load({ page, fetch, session, stuff }) {
		const searchKey = page.query.get('search');
		if (!searchKey) {
			return {
				props: {
					hadiths: [],
					filteredHadiths: []
				}
			};
		}
		const res = await fetch(`https://ask-hadith.vercel.app/api/search?search=${searchKey}`);

		if (res.ok) {
			const data = await res.json();
			return {
				props: {
					hadiths: data,
					filteredHadiths: data
				}
			};
		}
	}
</script>

<script>
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';

	import SearchBox from '$lib/SearchBox.svelte';
	import Hadith from '$lib/Hadith.svelte';
	import HadithFilters from '$lib/HadithFilters.svelte';

	export let hadiths;
	export let filteredHadiths;
	let searching = false;
	let searchKey = '';

	const setSearchKeyIfPresentInQueryParam = () => {
		const searchKeyParam = new URLSearchParams(window.location.search);
		if (searchKeyParam.has('search')) {
			searchKey = searchKeyParam.get('search');
		}
	};

	// for each hadith extract body_en.texts.type==hit from highlights and save in hadith.highlight_hits
	$: for (let i = 0; i < hadiths.length; i++) {
		let hadith = hadiths[i];
		let highlight_hits = [];
		if (hadith.highlights)
		for (let j = 0; j < hadith.highlights.length; j++) {
			let highlight = hadith.highlights[j];
			for (let k = 0; k < highlight.texts.length; k++) {
				let text = highlight.texts[k];
				if (text.type === 'hit') {
					highlight_hits.push(text.value);
				}
			}
		}
		hadith.highlight_hits = highlight_hits;
	}

	onMount(() => {
		setSearchKeyIfPresentInQueryParam();
	});
</script>

<svelte:head>
	<title>Ask Hadith</title>
</svelte:head>

<div in:fade class="max-w-4xl mx-auto">
	<div class="top-0 z-10 my-12 md:sticky md:p-4">
		<div class="flex mx-auto">
			<SearchBox bind:hadiths bind:searching bind:searchKey />
		</div>
	</div>
	{#if searching}
		<p class="flex items-center justify-center mt-10 mb-20 animate-pulse">Searching...</p>
	{:else}
		<div class="md:py-4">
			<HadithFilters bind:hadiths bind:filteredHadiths />
		</div>
		<div class="flex flex-col">
			<div class="mx-auto">
				{#each filteredHadiths as hadith}
					<Hadith bind:hadith bind:searchKey />
				{/each}
			</div>
		</div>
	{/if}
</div>
