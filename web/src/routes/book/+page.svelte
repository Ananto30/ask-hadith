<script lang="ts">
	import { fade } from 'svelte/transition';

	import Hadith from '$lib/Hadith.svelte';
	import type { HadithModel } from '../models';

	export let data;

	let hadith: HadithModel = data.hadith;
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
