<script lang="ts">
	import type { HadithModel } from 'src/routes/models';
	import SearchSvg from './svgs/search.svelte';

	export let hadiths: HadithModel[];
	export let filteredHadiths: HadithModel[];
	export let searching: boolean;
	export let searchKey: string;
	export let notFound: boolean;

	const searchHadiths = async () => {
		if (searchKey.length < 2) {
			return;
		}
		hadiths = [];
		filteredHadiths = [];
		searching = true;
		notFound = false;
		try {
			const response = await fetch(`https://ask-hadith.vercel.app/api/search?search=${searchKey}`);
			hadiths = await response.json();
			filteredHadiths = hadiths;
			if (hadiths == null) {
				notFound = true;
				hadiths = [];
				filteredHadiths = [];
			}
		} catch (error) {
			console.log(error);
			notFound = true;
			hadiths = [];
			filteredHadiths = [];
		}
		window.history.pushState({}, '', `?search=${searchKey}`);
		searching = false;
	};

	const handleKeyup = (e: { keyCode: number; preventDefault: () => void }) => {
		if (e.keyCode == 13) {
			const current = document.activeElement;
			if (current instanceof HTMLElement) current.blur();
			e.preventDefault();
			searchHadiths();
		}
	};
</script>

<div class="flex-col items-center justify-center mx-auto">
	<div class="flex w-full mx-4 border-b border-gray-400 md:w-80">
		<input
			type="text"
			class="w-full px-4 py-2 text-xs md:w-80 focus:outline-none"
			placeholder="Qadr, bukhari 1029, muslim 1763 etc..."
			bind:value={searchKey}
			on:keyup={handleKeyup}
		/>
		<button
			class="flex items-center justify-center px-4"
			on:click={searchHadiths}
			aria-label="Search Hadiths"
		>
			<SearchSvg />
		</button>
	</div>
	<!-- <div class="flex-col text-xs mt-3 text-gray-400 text-center">
		To search specific hadith use like this -
		<br />
		bukhari 1028, muslim 3, etc.
	</div> -->
</div>
