<script lang="ts">
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';
	import Hadith from '$lib/Hadith.svelte';
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

<div in:fade class="min-h-screen bg-white dark:bg-neutral-900">
	<!-- Header Section -->
	<div
		class="border-b border-neutral-200 bg-neutral-50 py-8 dark:border-neutral-800 dark:bg-neutral-900"
	>
		<div class="mx-auto max-w-4xl px-4">
			<h1 class="text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
				Bookmarks
			</h1>
			<p class="mt-2 text-base text-neutral-600 dark:text-neutral-300">
				Your saved hadiths ({bookmarkedHadiths.length})
			</p>
		</div>
	</div>

	<!-- Content Section -->
	<div class="bg-white dark:bg-neutral-900">
		{#if bookmarkedHadiths?.length === 0}
			<div class="flex justify-center py-16">
				<div class="text-center">
					<p class="mb-4 text-5xl">📚</p>
					<p class="mb-2 text-lg font-medium text-neutral-900 dark:text-neutral-50">
						No bookmarks yet
					</p>
					<p class="mb-6 text-sm text-neutral-600 dark:text-neutral-300">
						Start bookmarking hadiths to save them for later
					</p>
					<a
						href="/"
						class="inline-block rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
					>
						Search Hadiths
					</a>
				</div>
			</div>
		{:else}
			<div class="mx-auto max-w-4xl px-4 py-8">
				<div
					class="mb-6 rounded-lg border border-neutral-200 bg-neutral-50 p-4 text-sm text-neutral-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400"
				>
					<div>
						<span class="font-medium">Note:</span> Bookmarks are saved locally in your browser. Clearing
						your cache or browser data will remove them.
					</div>
				</div>
				<div class="space-y-3 pb-20">
					{#each bookmarkedHadiths as hadith}
						<Hadith bind:hadith />
					{/each}
				</div>
			</div>
		{/if}
	</div>
</div>
