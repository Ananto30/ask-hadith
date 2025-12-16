<script lang="ts">
	import { slide } from 'svelte/transition';
	import { hadithsByCollection, selectedCollection } from '../store';
	import Hadith from '$lib/Hadith.svelte';
	import type { HadithModel } from '../models';

	let hadiths: HadithModel[] = [];

	$: if ($hadithsByCollection.has($selectedCollection)) {
		hadiths = $hadithsByCollection.get($selectedCollection) || [];
	}
</script>

<div in:slide class="mx-auto max-w-4xl space-y-6 px-4 pt-6 pb-20">
	{#each hadiths as hadith}
		<Hadith bind:hadith />
	{/each}
</div>
