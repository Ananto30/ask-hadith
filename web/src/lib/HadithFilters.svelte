<script lang="ts">
	import { selectedCollection, collectionsSorted } from '../store';
</script>

<div class="flex justify-center pb-4 dark:border-neutral-700">
	<div class="flex max-w-4xl flex-wrap items-center justify-center gap-2 px-4">
		{#if $collectionsSorted.length > 0}
			{#each $collectionsSorted as col}
				<button
					aria-label="Select Collection"
					class="{$selectedCollection === col.collection
						? 'border-neutral-900 bg-neutral-900 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900'
						: 'border-neutral-300 bg-white text-neutral-700 hover:border-neutral-400 dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-300 dark:hover:border-neutral-500'} rounded-md border px-3 py-1.5 text-sm font-medium transition-colors duration-200"
					on:click={() => ($selectedCollection = col.collection)}
				>
					<span>{col.collection}</span>
					<span class="ml-2 opacity-70">({col.count})</span>
				</button>
			{/each}
		{/if}
	</div>
</div>
