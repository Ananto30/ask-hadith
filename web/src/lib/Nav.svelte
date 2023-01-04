<script lang="ts">
	import type { BeforeInstallPromptEvent } from 'src/routes/models';
	import { onMount } from 'svelte';

	import SearchSvg from '$lib/svgs/search.svelte';
	import BookmarksSvg from '$lib/svgs/bookmarks.svelte';
	import DownloadSvg from './svgs/download.svelte';
	import BooksSvg from './svgs/books.svelte';

	let deferredPrompt: BeforeInstallPromptEvent | null;
	let alreadyInstalled = true;

	const install = async () => {
		if (deferredPrompt !== null) {
			deferredPrompt.prompt();
			const { outcome } = await deferredPrompt.userChoice;
			if (outcome === 'accepted') {
				deferredPrompt = null;
			}
		}
	};

	onMount(() => {
		window.addEventListener('beforeinstallprompt', (e) => {
			deferredPrompt = e;
		});
		if (!window.matchMedia('(display-mode: standalone)').matches) {
			alreadyInstalled = false;
		}
	});
</script>

<nav class="sticky top-0 z-10 p-2 bg-white md:p-4">
	<div class="max-w-6xl mx-auto">
		<ul class="flex flex-row justify-end gap-4 p-2 text-sm font-medium text-gray-600">
			<li>
				<a class="flex flex-row items-center gap-1 hover:underline" href="/">
					<SearchSvg />
					Search
				</a>
			</li>
			<li>
				<a class="flex flex-row items-center gap-1 hover:underline" href="/bookmarks">
					<BookmarksSvg />
					Bookmarks
				</a>
			</li>
			{#if !alreadyInstalled}
				<li>
					<button
						class="flex flex-row gap-1 items-center font-medium hover:underline"
						on:click={install}
					>
						<DownloadSvg />
						Install</button
					>
				</li>
			{/if}
			<!-- <li>
				<div class="flex flex-col">
					<a class="flex flex-row items-center gap-1 text-gray-300 hover:underline" href="">
						<BooksSvg />
						Hadith Books
					</a>
					<p class="text-xs text-gray-300">coming soon*</p>
				</div>
			</li> -->
		</ul>
	</div>
</nav>
