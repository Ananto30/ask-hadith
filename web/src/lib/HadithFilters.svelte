<script lang="ts">
	import { selectedCollection, collectionsSorted } from '../store';
</script>

<div class="md:py-4">
	<div class="flex flex-wrap items-center justify-center gap-2 px-2 mx-auto">
		{#if $collectionsSorted.length > 0}
			{#each $collectionsSorted as col}
				<button
					class="{$selectedCollection === col.collection
						? 'bg-black text-white '
						: ''} px-2 py-1 my-auto text-xs font-medium border border-gray-400 hover:bg-black hover:text-white h-7 transition duration-200 ease-in-out"
					on:click={() => ($selectedCollection = col.collection)}
				>
					{col.collection} <span class="">({col.count})</span>
				</button>
			{/each}
		{/if}
	</div>
</div>
