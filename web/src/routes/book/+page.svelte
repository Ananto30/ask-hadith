<script lang="ts">
	import { fade } from 'svelte/transition';
	import { searchKey } from '../../store';
	import Hadith from '#lib/Hadith.svelte';
	import type { HadithModel } from '../../models';

	export let data: { hadith: HadithModel; searchKey: string };

	const hadith: HadithModel = data.hadith;
	$searchKey = data.searchKey || '';

	const clip = (s: string, n: number) =>
		s.length > n ? s.slice(0, s.lastIndexOf(' ', n)) + '…' : s;

	const ogTitle = () =>
		`${hadith.collection} ${hadith.book_no}:${hadith.book_ref_no}` +
		(hadith.hadith_no ? ` (Hadith ${hadith.hadith_no})` : '');

	const ogDescription = () => clip(`${hadith.narrator_en ?? ''} ${hadith.body_en}`.trim(), 155);

	const ogImage = `https://www.askhadith.com/api/og?hadith=${hadith.base64}`;

	const jsonLd = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'CreativeWork',
		name: ogTitle(),
		text: hadith.body_en,
		inLanguage: 'en',
		isPartOf: { '@type': 'Book', name: hadith.collection }
	}).replace(/</g, '\\u003c');
</script>

<svelte:head>
	<title>{ogTitle()}</title>
	<meta name="description" content={ogDescription()} />
	{@html `<script type="application/ld+json">${jsonLd}</script>`}

	<!-- Facebook Meta Tags -->
	<meta property="og:type" content="website" />
	<meta property="og:title" content={ogTitle()} />
	<meta property="og:description" content={ogDescription()} />
	<meta property="og:image" content={ogImage} />

	<!-- Twitter Meta Tags -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta property="twitter:domain" content="askhadith.com" />
	<meta name="twitter:title" content={ogTitle()} />
	<meta name="twitter:description" content={ogDescription()} />
	<meta name="twitter:image" content={ogImage} />
</svelte:head>

<div in:fade class="mx-auto max-w-3xl px-5 sm:px-8">
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
</div>
