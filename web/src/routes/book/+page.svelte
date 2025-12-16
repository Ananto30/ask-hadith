<script lang="ts">
	import { fade } from 'svelte/transition';
	import { searchKey } from '../../store';
	import Hadith from '$lib/Hadith.svelte';
	import type { HadithModel } from '../../models';

	export let data: { hadith: HadithModel; searchKey: string };

	let hadith: HadithModel = data.hadith;
	$searchKey = data.searchKey || '';

	const ogTitle = () => {
		let text =
			hadith.collection + ' (Book: ' + hadith.book_no + ', Hadith: ' + hadith.book_ref_no + ') ';
		if (hadith.hadith_no) {
			text += 'Hadith No: ' + hadith.hadith_no;
		}
		return text;
	};

	const ogDescription = () => {
		let text = '';
		if (hadith.hadith_no) {
			text += hadith.narrator_en;
		}
		text += ' ' + hadith.body_en.substring(0, 100) + '...';
		return text;
	};
</script>

<svelte:head>
	<title>{ogTitle()}</title>
	<meta name="description" content={ogDescription()} />

	<!-- Facebook Meta Tags -->
	<meta property="og:type" content="website" />
	<meta property="og:title" content={ogTitle()} />
	<meta property="og:description" content={ogDescription()} />
	<meta property="og:image" content="https://www.askhadith.com/api/og?hadith={hadith.base64}" />

	<!-- Twitter Meta Tags -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta property="twitter:domain" content="askhadith.com" />
	<meta name="twitter:title" content={ogTitle()} />
	<meta name="twitter:description" content={ogDescription()} />
	<meta name="twitter:image" content="https://www.askhadith.com/api/og?hadith={hadith.base64}" />
</svelte:head>

<div in:fade class="min-h-screen bg-white dark:bg-neutral-900">
	{#if !hadith}
		<div class="flex justify-center py-20">
			<p class="text-lg font-medium text-neutral-600 dark:text-neutral-300">Hadith not found</p>
		</div>
	{:else}
		<!-- Header Section -->
		<div
			class="border-b border-neutral-200 bg-neutral-50 py-8 dark:border-neutral-800 dark:bg-neutral-900"
		>
			<div class="mx-auto max-w-4xl px-4">
				<h1 class="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
					{hadith.collection}
				</h1>
				<p class="mt-2 flex flex-wrap gap-4 text-sm text-neutral-600 dark:text-neutral-300">
					<span>Book <span class="font-medium">{hadith.book_no}</span></span>
					<span>•</span>
					<span>Hadith <span class="font-medium">{hadith.book_ref_no}</span></span>
				</p>
			</div>
		</div>

		<!-- Content Section -->
		<div class="bg-white dark:bg-neutral-900">
			<div class="mx-auto max-w-4xl px-4 py-8">
				<div class="mb-8">
					<Hadith bind:hadith />
				</div>

				<!-- Navigation -->
				{#if $searchKey}
					<div
						class="flex flex-col items-center gap-4 rounded-lg border border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-700 dark:bg-neutral-800"
					>
						<p class="text-sm text-neutral-600 dark:text-neutral-300">
							Looking for related hadiths?
						</p>
						<a
							href="/?search={$searchKey}"
							class="inline-block rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
						>
							View all results for "{$searchKey}"
						</a>
					</div>
				{/if}
			</div>
		</div>
	{/if}
</div>
