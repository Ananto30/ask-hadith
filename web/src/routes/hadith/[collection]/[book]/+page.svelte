<script lang="ts">
	import { fade } from 'svelte/transition';
	import { clip } from '#lib/site.ts';

	export let data: {
		id: string;
		collection: string;
		book_no: string;
		book_en: string;
		hadiths: {
			book_ref_no: string;
			hadith_no: string;
			narrator_en: string;
			snippet: string;
			chapter_en: string;
		}[];
	};
</script>

<svelte:head>
	<title>{data.collection} Book {data.book_no}: {data.book_en}</title>
	<meta
		name="description"
		content={clip(
			`${data.hadiths.length} hadiths from ${data.collection}, Book ${data.book_no}: ${data.book_en}. ${data.hadiths[0]?.snippet ?? ''}`,
			155
		)}
	/>
</svelte:head>

<div in:fade class="mx-auto max-w-3xl px-5 sm:px-8">
	<header class="border-line border-b pt-16 pb-8 sm:pt-20">
		<nav aria-label="Breadcrumb" class="text-muted mb-4 text-sm">
			<a href="/hadith" class="hover:text-ink hover:underline">Hadith</a>
			<span aria-hidden="true">/</span>
			<a href="/hadith/{data.id}" class="hover:text-ink hover:underline">{data.collection}</a>
		</nav>
		<h1 class="font-serif text-4xl font-medium tracking-[-0.02em] text-balance">
			{data.book_en}
		</h1>
		<p class="text-muted mt-3 font-mono text-sm tabular-nums">
			{data.collection} · Book {data.book_no} · {data.hadiths.length} hadiths
		</p>
	</header>

	<ol class="divide-line divide-y pb-24">
		{#each data.hadiths as h, i}
			<li class="py-5">
				{#if h.chapter_en && h.chapter_en !== data.hadiths[i - 1]?.chapter_en}
					<p class="text-ink-2 mb-2 text-sm font-medium">{h.chapter_en}</p>
				{/if}
				<a
					href="/hadith/{data.id}/{data.book_no}/{h.book_ref_no}"
					class="block no-underline hover:underline"
				>
					<span class="text-muted mr-2 font-mono text-xs tabular-nums">{h.book_ref_no}</span>
					<span class="font-serif">{h.narrator_en} {h.snippet}</span>
				</a>
			</li>
		{/each}
	</ol>
</div>
