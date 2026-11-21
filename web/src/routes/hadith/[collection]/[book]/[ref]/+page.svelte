<script lang="ts">
	import Hadith from '#lib/Hadith.svelte';
	import { ORIGIN, clip, hadithPath } from '#lib/site.ts';
	import { fade } from 'svelte/transition';
	import type { HadithModel } from '../../../../../models';

	export let data: { hadith: HadithModel; searchKey: string | null };

	$: hadith = data.hadith;
	$: path = hadithPath(hadith.collection_id, hadith.book_no, hadith.book_ref_no);
	$: ref = `${hadith.collection} ${hadith.book_no}:${hadith.book_ref_no}`;
	// Searchers type the content, not "Bukhari 1:3", so lead title and h1 with the text.
	const noTranslation = 'English translation is not available for this narration.';
	$: bodyText = hadith.body_en?.trim() || noTranslation;
	$: title = `${clip(bodyText, 55)} | ${ref}`;
	$: heading = clip(bodyText, 90);
	$: description = clip(`${hadith.narrator_en ?? ''} ${bodyText}`.trim(), 155);
	$: ogImage = `${ORIGIN}/api/og?hadith=${hadith.base64}`;

	$: jsonLd = JSON.stringify({
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'CreativeWork',
				'@id': ORIGIN + path,
				url: ORIGIN + path,
				name: ref,
				text: bodyText,
				inLanguage: 'en',
				isPartOf: { '@type': 'Book', name: hadith.collection }
			},
			{
				'@type': 'BreadcrumbList',
				itemListElement: [
					{ name: 'Hadith', item: '/hadith' },
					{ name: hadith.collection, item: `/hadith/${hadith.collection_id}` },
					{ name: hadith.book_en, item: `/hadith/${hadith.collection_id}/${hadith.book_no}` },
					{ name: ref, item: path }
				].map((c, i) => ({
					'@type': 'ListItem',
					position: i + 1,
					name: c.name,
					item: ORIGIN + c.item
				}))
			}
		]
	}).replace(/</g, '\\u003c');

	$: bookPath = `/hadith/${hadith.collection_id}/${hadith.book_no}`;
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	{@html `<script type="application/ld+json">${jsonLd}</script>`}
	{#if data.hadith.prev}
		<link rel="prev" href="{ORIGIN}{bookPath}/{hadith.prev}" />
	{/if}
	{#if data.hadith.next}
		<link rel="next" href="{ORIGIN}{bookPath}/{hadith.next}" />
	{/if}

	<!-- Facebook Meta Tags -->
	<meta property="og:url" content={ORIGIN + path} />
	<meta property="og:type" content="article" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={ogImage} />

	<!-- Twitter Meta Tags -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta property="twitter:domain" content="askhadith.com" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={ogImage} />
</svelte:head>

<div in:fade class="mx-auto max-w-3xl px-5 sm:px-8">
	<header class="border-line border-b pt-16 pb-8 sm:pt-20">
		<nav aria-label="Breadcrumb" class="text-muted mb-4 text-sm">
			<a href="/hadith" class="hover:text-ink hover:underline">Hadith</a>
			<span aria-hidden="true">/</span>
			<a href="/hadith/{hadith.collection_id}" class="hover:text-ink hover:underline"
				>{hadith.collection}</a
			>
			<span aria-hidden="true">/</span>
			<a href={bookPath} class="hover:text-ink hover:underline">Book {hadith.book_no}</a>
		</nav>
		<h1 class="font-serif text-3xl font-medium tracking-[-0.02em] text-balance sm:text-4xl">
			{heading}
		</h1>
		<p class="text-muted mt-3 flex gap-4 font-mono text-sm tabular-nums">
			<span>{hadith.collection}</span>
			<span>Book {hadith.book_no}</span>
			<span>Hadith {hadith.book_ref_no}</span>
		</p>
	</header>

	<Hadith {hadith} />

	<nav
		aria-label="Neighbouring hadiths"
		class="border-line flex justify-between border-t py-6 text-sm"
	>
		{#if hadith.prev}
			<a href="{bookPath}/{hadith.prev}" rel="prev" class="text-ink-2 hover:text-ink underline"
				>← Hadith {hadith.prev}</a
			>
		{:else}
			<span></span>
		{/if}
		{#if hadith.next}
			<a href="{bookPath}/{hadith.next}" rel="next" class="text-ink-2 hover:text-ink underline"
				>Hadith {hadith.next} →</a
			>
		{/if}
	</nav>

	{#if data.searchKey}
		<div class="border-line border-t py-10">
			<a
				href="/?search={encodeURIComponent(data.searchKey)}"
				class="text-ink-2 hover:text-ink text-sm underline decoration-1"
			>
				← All results for “{data.searchKey}”
			</a>
		</div>
	{/if}
</div>
