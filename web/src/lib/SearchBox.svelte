<script>
	export let hadiths;
	export let searching;
	export let searchKey;
	export let notFound;

	const searchHadiths = async () => {
		if (searchKey.length < 2) {
			return;
		}
		hadiths = [];
		searching = true;
		try {
			const response = await fetch(`https://ask-hadith.vercel.app/api/search?search=${searchKey}`);
			hadiths = await response.json();
			if (hadiths == null) {
				notFound = true;
				hadiths = [];
			}
		} catch (error) {
			console.log(error);
			notFound = true;
			hadiths = [];
		}
		window.history.pushState({}, '', `?search=${searchKey}`);
		searching = false;
	};

	const handleKeyup = (e) => {
		if (e.keyCode == 13) {
			const current = document.activeElement;
			current.blur();
			e.preventDefault();
			searchHadiths();
		}
	};
</script>

<div class="flex items-center justify-center mx-auto">
	<div class="flex w-full mx-4 border-b border-gray-400 md:w-80">
		<input
			type="text"
			class="w-full px-4 py-2 text-sm md:w-80 focus:outline-none"
			placeholder="Search..."
			bind:value={searchKey}
			on:keyup={handleKeyup}
		/>
		<button
			class="flex items-center justify-center px-4"
			on:click={searchHadiths}
			aria-label="Search Hadiths"
		>
			<svg
				class="w-4 h-4 text-gray-600"
				fill="currentColor"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
			>
				<path
					d="M16.32 14.9l5.39 5.4a1 1 0 0 1-1.42 1.4l-5.38-5.38a8 8 0 1 1 1.41-1.41zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z"
				/>
			</svg>
		</button>
	</div>
</div>
