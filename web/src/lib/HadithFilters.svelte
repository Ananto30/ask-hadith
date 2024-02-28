<script lang="ts">
	import { selectedCollection, collectionsSorted } from '../store';
</script>

<div class="py-4 md:mb-4">
	<div
		class="mx-auto flex flex-wrap items-center justify-center gap-2 px-2 dark:hover:text-gray-200"
	>
		{#if $collectionsSorted.length > 0}
			{#each $collectionsSorted as col}
				<button
					aria-label="Select Collection"
					class="{$selectedCollection === col.collection
						? 'bg-gray-800 text-white dark:bg-gray-700 dark:text-gray-200'
						: 'bg-white dark:bg-gray-800 dark:text-gray-400'} my-auto h-7 rounded-lg px-2 py-1 text-xs font-medium shadow transition duration-200 ease-in-out hover:bg-gray-800 hover:text-white dark:border-gray-700 dark:hover:bg-gray-700"
					on:click={() => ($selectedCollection = col.collection)}
				>
					{col.collection} <span class="">({col.count})</span>
				</button>
			{/each}
		{/if}
	</div>
</div>
