<script lang="ts">
	import type { HadithModel } from 'src/routes/models';

	export let hadiths: HadithModel[];
	export let filteredHadiths: HadithModel[];

	let hadithCollections = ['All'];

	let collectionFilter = 'All';

	$: if (hadiths) {
		filteredHadiths = hadiths;
	}

	$: if (collectionFilter) {
		filteredHadiths = [];
		if (collectionFilter === 'All') {
			filteredHadiths = hadiths;
		} else {
			filteredHadiths = hadiths.filter((hadith) => {
				return hadith.collection === collectionFilter;
			});
		}
	}

	// from hadiths extract unique collections
	$: for (let i = 0; i < hadiths.length; i++) {
		let hadith = hadiths[i];
		if (hadithCollections.indexOf(hadith.collection) === -1) {
			hadithCollections = [...hadithCollections, hadith.collection];
		}
	}
</script>

<!-- <div class="flex items-center justify-center gap-2 mx-auto">
	<button
		class="px-2 py-1 my-auto text-xs font-medium border border-gray-400 hover:bg-black hover:text-white h-7"
		on:click={() => {
			filteredHadiths = hadiths;
			readFilter = '';
			hadithFilter = '';
		}}
	>
		All
	</button>
	<button
		class="px-2 py-1 my-auto text-xs font-medium border border-gray-400 hover:bg-black hover:text-white h-7"
	>
		Read
	</button>
	<button
		class="px-2 py-1 my-auto text-xs font-medium border border-gray-400 hover:bg-black hover:text-white h-7"
	>
		Unread
	</button>
</div> -->
<div class="flex flex-wrap items-center justify-center gap-2 px-2 mx-auto">
	{#if hadithCollections.length > 1}
		{#each hadithCollections as col}
			<button
				class="{collectionFilter === col
					? 'bg-black text-white '
					: ''} px-2 py-1 my-auto text-xs font-medium border border-gray-400 hover:bg-black hover:text-white h-7 transition duration-200 ease-in-out"
				on:click={() => (collectionFilter = col)}
			>
				{col}
			</button>
		{/each}
	{/if}
</div>
