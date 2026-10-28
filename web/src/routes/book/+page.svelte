<script lang="ts">
	import { fade } from 'svelte/transition';
	import { searchKey } from '../../store';
	import Hadith from '#lib/Hadith.svelte';
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

<div in:fade class="mx-auto max-w-3xl px-5 sm:px-8">
	{#if !hadith}
		<p class="text-muted py-24 font-serif text-xl">Hadith not found.</p>
	{:else}
		<header class="border-line border-b pt-16 pb-8 sm:pt-20">
			<h1 class="font-serif text-4xl font-medium tracking-[-0.02em] text-balance">
				{hadith.collection}
			</h1>
			<p class="text-muted mt-3 flex gap-4 font-mono text-sm tabular-nums">
				<span>Book {hadith.book_no}</span>
				<span>Hadith {hadith.book_ref_no}</span>
			</p>
		</header>

		<Hadith {hadith} />

		{#if $searchKey}
			<div class="border-line border-t py-10">
				<a
					href="/?search={$searchKey}"
					class="text-ink-2 hover:text-ink text-sm underline decoration-1"
				>
					← All results for “{$searchKey}”
				</a>
			</div>
		{/if}
	{/if}
</div>
