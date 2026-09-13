<script lang="ts">
	import { onMount } from 'svelte';
	import type { BeforeInstallPromptEvent } from '../models';

	import SearchSvg from '$lib/svgs/search.svelte';
	import BookmarksSvg from '$lib/svgs/bookmarks.svelte';
	import DownloadSvg from './svgs/download.svelte';

	let deferredPrompt: BeforeInstallPromptEvent | null = null;
	let showInstallButton = false;

	const install = async () => {
		if (deferredPrompt) {
			deferredPrompt.prompt();
			const { outcome } = await deferredPrompt.userChoice;
			if (outcome === 'accepted') {
				deferredPrompt = null;
			}
		}
	};

	const showInstall = () => {
		return deferredPrompt != null && !alreadyInstalled();
	};

	const alreadyInstalled = () => {
		return window.matchMedia('(display-mode: standalone)').matches;
	};

	onMount(() => {
		window.addEventListener('beforeinstallprompt', (e) => {
			deferredPrompt = e as BeforeInstallPromptEvent;
		});
		showInstallButton = showInstall();
	});
</script>

<nav class="border-b border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="flex h-16 items-center justify-between">
			<a
				href="/"
				class="flex items-center gap-2 font-semibold text-neutral-900 dark:text-neutral-50"
			>
				<span class="text-lg">📖</span>
				<span class="hidden sm:inline">Ask Hadith</span>
			</a>

			<ul class="flex items-center gap-6 text-sm">
				<li>
					<a
						class="flex flex-row items-center gap-2 font-medium text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-50"
						href="/"
					>
						<SearchSvg />
						<span class="hidden sm:inline">Search</span>
					</a>
				</li>
				<li>
					<a
						class="flex flex-row items-center gap-2 font-medium text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-50"
						href="/bookmarks"
					>
						<BookmarksSvg />
						<span class="hidden sm:inline">Bookmarks</span>
					</a>
				</li>
				{#if showInstallButton}
					<li>
						<button
							aria-label="Install App"
							class="flex flex-row items-center gap-2 font-medium text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-50"
							on:click={install}
						>
							<DownloadSvg />
							<span class="hidden sm:inline">Install</span>
						</button>
					</li>
				{/if}
			</ul>
		</div>
	</div>
</nav>
