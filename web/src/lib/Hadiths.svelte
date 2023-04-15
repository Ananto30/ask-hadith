<script lang="ts">
	import { hadithsByCollection, selectedCollection } from '../store';
	import Hadith from '$lib/Hadith.svelte';
	import type { HadithModel } from '../models';

	let hadiths: HadithModel[] = [];

	$: if ($hadithsByCollection.has($selectedCollection)) {
		hadiths = $hadithsByCollection.get($selectedCollection) || [];
	}
</script>

<div class="flex flex-col">
	<div class="mx-auto">
		{#each hadiths as hadith}
			<Hadith bind:hadith />
		{/each}
	</div>
</div>
