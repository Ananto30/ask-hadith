<script lang="ts">
	import { hadithsByCollection, selectedCollection } from '../store';
	import Hadith from '#lib/Hadith.svelte';

	$: hadiths = $hadithsByCollection.get($selectedCollection) || [];
</script>

<div class="divide-line divide-y pb-24">
	{#each hadiths as hadith}
		<Hadith {hadith} />
	{/each}
</div>
