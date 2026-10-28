<script lang="ts">
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';
	import Hadith from '#lib/Hadith.svelte';
	import type { HadithModel } from '../../models';

	let bookmarkedHadiths: HadithModel[] = [];

	onMount(
		() => (bookmarkedHadiths = JSON.parse(localStorage.getItem('bookmarkedHadiths') || '[]') || [])
	);
</script>

<svelte:head>
	<title>Ask Hadith: Bookmarks</title>
	<meta name="description" content="Bookmarked Hadiths" />
</svelte:head>

<div in:fade class="mx-auto max-w-3xl px-5 sm:px-8">
	<header class="border-line border-b pt-16 pb-8 sm:pt-20">
		<h1 class="font-serif text-4xl font-medium tracking-[-0.02em]">Bookmarks</h1>
		<p class="text-muted mt-3 max-w-[60ch] text-sm leading-relaxed">
			<span class="font-mono tabular-nums">{bookmarkedHadiths.length}</span> saved. Bookmarks live in
			this browser only; clearing site data removes them.
		</p>
	</header>

	{#if bookmarkedHadiths?.length === 0}
		<div class="py-16">
			<p class="font-serif text-xl">No bookmarks yet</p>
			<p class="text-muted mt-2 text-sm">Tap the bookmark icon on any hadith to keep it here.</p>
			<a
				href="/"
				class="bg-ink text-paper mt-6 inline-flex h-10 items-center rounded-md px-4 text-sm font-medium hover:opacity-85"
			>
				Search hadiths
			</a>
		</div>
	{:else}
		<div class="divide-line divide-y pb-24">
			{#each bookmarkedHadiths as hadith}
				<Hadith {hadith} />
			{/each}
		</div>
	{/if}
</div>
