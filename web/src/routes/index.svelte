<script>
	import { fade } from 'svelte/transition';

	import SearchBox from '$lib/SearchBox.svelte';
	import Hadith from '$lib/Hadith.svelte';
	import HadithFilters from '$lib/HadithFilters.svelte';

	let hadiths = [];
	let filteredHadiths = [];
	let searching = false;

	// for each hadith extract body_en.texts.type==hit from highlights and save in hadith.highlight_hits
	$: for (let i = 0; i < hadiths.length; i++) {
		let hadith = hadiths[i];
		let highlight_hits = [];
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
</script>

<svelte:head>
	<title>Ask Hadith</title>
</svelte:head>

<div in:fade class="max-w-4xl mx-auto">
	<div class="flex pt-10 pb-8 mx-auto md:pt-12">
		<SearchBox bind:hadiths bind:searching />
	</div>
	{#if searching}
		<p class="flex items-center justify-center mt-8 mb-20 animate-pulse">Searching...</p>
	{:else}
		<div class="md:py-4">
			<HadithFilters bind:hadiths bind:filteredHadiths />
		</div>
		<div class="flex flex-col">
			<div class="mx-auto">
				{#each filteredHadiths as hadith}
					<Hadith bind:hadith />
				{/each}
			</div>
		</div>
	{/if}
	<div class="mt-8">
		<p class="text-xs font-medium text-center text-gray-500">
			Built with ❤️ by <a href="https://github.com/ananto30" class="text-gray-500 hover:underline"
				>Ananto</a
			>
		</p>
		<p class="text-xs text-center text-gray-500">
			<a href="https://www.patreon.com/ananto" class="font-medium text-gray-500 hover:underline"
				>Support this project</a
			>
		</p>
		<p class="text-xs text-center text-gray-500">
			© 2021
			<span class="mx-1">|</span>
			<a href="https://github.com/Ananto30/ask-hadith" class="text-gray-500 hover:underline"
				>Ask Hadith</a
			>
		</p>
	</div>
</div>
