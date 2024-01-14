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

<div in:slide class="flex flex-col gap-4 md:gap-8">
	{#each hadiths as hadith}
		<Hadith bind:hadith />
	{/each}
</div>
