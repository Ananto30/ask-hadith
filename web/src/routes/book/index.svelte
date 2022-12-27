<script context="module">
	export async function load({ page, fetch, session, stuff }) {
		const collectionId = page.query.get('collection_id');
		const book = page.query.get('book');
		const refNumber = page.query.get('ref_no');

		if (!collectionId || !book || !refNumber) {
			return {
				props: {
					hadith: null
				}
			};
		}

		const res = await fetch(
			`https://ask-hadith.vercel.app/api/book?collection_id=${collectionId}&book=${book}&ref_no=${refNumber}`
		);

		if (res.ok) {
			const data = await res.json();
			return {
				props: {
					hadith: data
				}
			};
		}
	}
</script>

<script>
	import { fade } from 'svelte/transition';

	import Hadith from '$lib/Hadith.svelte';

	export let hadith;
</script>

<svelte:head>
	<title>Ask Hadith</title>
</svelte:head>

<div in:fade class="max-w-4xl mx-auto">
	{#if !hadith}
		<p class="flex items-center justify-center py-20">Nothing found!</p>
	{:else}
		<div class="flex flex-col">
			<div class="mx-auto">
				<Hadith bind:hadith />
			</div>
		</div>
	{/if}
</div>
