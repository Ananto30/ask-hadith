<script lang="ts">
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';
	import Hadith from '$lib/Hadith.svelte';
	import type { HadithModel } from '../../models';

	let bookmarkedHadiths: HadithModel[] = [];
	let searchKey = '';

	onMount(
		() => (bookmarkedHadiths = JSON.parse(localStorage.getItem('bookmarkedHadiths') || '{}') || [])
	);
</script>

<svelte:head>
	<title>Ask Hadith</title>
</svelte:head>

<div in:fade class="max-w-4xl mx-auto">
	<p class="flex items-center justify-center px-4 text-xs text-gray-500">
		*Please note that these bookmarks are saved in local cache, so if you clear data/cache, it will
		be gone!
	</p>
	{#if bookmarkedHadiths.length == 0}
		<p class="flex items-center justify-center py-20">No bookmarks found!</p>
	{:else}
		<div class="flex flex-col">
			<div class="mx-auto">
				{#each bookmarkedHadiths as hadith}
					<Hadith bind:hadith bind:searchKey />
				{/each}
			</div>
		</div>
	{/if}
</div>
