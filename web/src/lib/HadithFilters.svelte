<script lang="ts">
	import { selectedCollection, collectionsSorted } from '../store';
</script>

{#if $collectionsSorted.length > 0}
	<!-- horizontal scroll keeps the tab row one line on phones instead of wrapping into a block -->
	<div
		class="border-line -mx-5 [scrollbar-width:none] overflow-x-auto border-b px-5 sm:mx-0 sm:px-0"
		role="tablist"
		aria-label="Collections"
	>
		<div class="flex gap-6 whitespace-nowrap">
			{#each $collectionsSorted as col}
				<button
					role="tab"
					aria-selected={$selectedCollection === col.collection}
					class="text-muted hover:text-ink aria-selected:border-ink aria-selected:text-ink -mb-px flex cursor-pointer items-baseline gap-1.5 border-b-2 border-transparent py-3 text-sm transition-colors"
					on:click={() => ($selectedCollection = col.collection)}
				>
					{col.collection}
					<span class="font-mono text-xs tabular-nums opacity-70">{col.count}</span>
				</button>
			{/each}
		</div>
	</div>
{/if}
