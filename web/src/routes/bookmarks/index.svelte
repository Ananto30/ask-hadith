<script>
	import Hadith from '$lib/Hadith.svelte';
	import { onMount } from 'svelte';

	let bookmarkedHadiths = [];

	onMount(() => {
		bookmarkedHadiths = JSON.parse(localStorage.getItem('bookmarkedHadiths')) || [];
	});
</script>

<svelte:head>
	<title>Ask Hadith</title>
</svelte:head>

<div class="max-w-4xl mx-auto mt-8">
	{#if bookmarkedHadiths.length == 0}
		<p class="flex items-center justify-center mt-12 mb-28">No bookmarks found!</p>
	{:else}
		<div class="flex flex-col">
			<div class="mx-auto">
				{#each bookmarkedHadiths as hadith}
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
