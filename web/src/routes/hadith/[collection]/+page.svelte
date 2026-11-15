<script lang="ts">
	import { fade } from 'svelte/transition';

	export let data: {
		id: string;
		collection: string;
		books: { book_no: string; book_en: string; count: number }[];
	};

	$: total = data.books.reduce((n, b) => n + b.count, 0);
</script>

<svelte:head>
	<title>{data.collection}: All {data.books.length} Books in English</title>
	<meta
		name="description"
		content="Read {data.collection} in English: {total} hadiths across {data.books
			.length} books. Browse by book and chapter."
	/>
</svelte:head>

<div in:fade class="mx-auto max-w-3xl px-5 sm:px-8">
	<header class="border-line border-b pt-16 pb-8 sm:pt-20">
		<nav aria-label="Breadcrumb" class="text-muted mb-4 text-sm">
			<a href="/hadith" class="hover:text-ink hover:underline">Hadith</a>
		</nav>
		<h1 class="font-serif text-4xl font-medium tracking-[-0.02em] text-balance">
			{data.collection}
		</h1>
		<p class="text-muted mt-3 font-mono text-sm tabular-nums">
			{data.books.length} books · {total} hadiths
		</p>
	</header>

	<ol class="divide-line divide-y pb-24">
		{#each data.books as b}
			<li>
				<a
					href="/hadith/{data.id}/{b.book_no}"
					class="hover:text-ink flex items-baseline justify-between gap-4 py-4 no-underline hover:underline"
				>
					<span
						><span class="text-muted mr-2 font-mono text-xs tabular-nums">{b.book_no}</span
						>{b.book_en}</span
					>
					<span class="text-muted font-mono text-xs tabular-nums">{b.count}</span>
				</a>
			</li>
		{/each}
	</ol>
</div>
