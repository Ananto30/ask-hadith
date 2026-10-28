<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import type { BeforeInstallPromptEvent } from '../models';
	import { theme } from '../store';

	import SearchSvg from '$lib/svgs/search.svelte';
	import BookmarksSvg from '$lib/svgs/bookmarks.svelte';
	import DownloadSvg from './svgs/download.svelte';

	let deferredPrompt: BeforeInstallPromptEvent | null = null;
	let showInstall = false;

	const install = async () => {
		if (!deferredPrompt) return;
		deferredPrompt.prompt();
		const { outcome } = await deferredPrompt.userChoice;
		if (outcome === 'accepted') showInstall = false;
	};

	onMount(() => {
		window.addEventListener('beforeinstallprompt', (e) => {
			deferredPrompt = e as BeforeInstallPromptEvent;
			showInstall = !window.matchMedia('(display-mode: standalone)').matches;
		});
	});

	const next = { system: 'light', light: 'dark', dark: 'system' } as const;

	const link =
		'flex items-center gap-2 py-2 text-ink-2 transition-colors hover:text-ink aria-[current=page]:text-ink';
</script>

<nav class="bg-paper/90 border-line sticky top-0 z-40 border-b backdrop-blur-sm">
	<div class="mx-auto flex h-14 max-w-3xl items-center justify-between px-5 sm:px-8">
		<a href="/" class="font-serif text-lg font-semibold tracking-[-0.01em] no-underline">
			Ask Hadith
		</a>

		<ul class="flex items-center gap-5 text-sm sm:gap-7">
			<li>
				<a class={link} href="/" aria-current={$page.url.pathname === '/' ? 'page' : undefined}>
					<SearchSvg />
					<span class="hidden sm:inline">Search</span>
				</a>
			</li>
			<li>
				<a
					class={link}
					href="/bookmarks"
					aria-current={$page.url.pathname === '/bookmarks' ? 'page' : undefined}
				>
					<BookmarksSvg />
					<span class="hidden sm:inline">Bookmarks</span>
				</a>
			</li>
			{#if showInstall}
				<li>
					<button aria-label="Install App" class={link} on:click={install}>
						<DownloadSvg />
						<span class="hidden sm:inline">Install</span>
					</button>
				</li>
			{/if}
			<li>
				<button
					class="{link} cursor-pointer"
					aria-label="Theme: {$theme}. Switch to {next[$theme]}"
					title="Theme: {$theme}"
					on:click={() => theme.set(next[$theme])}
				>
					<svg
						class="h-4 w-4"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						aria-hidden="true"
					>
						{#if $theme === 'light'}
							<circle cx="12" cy="12" r="4" /><path
								d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M6.3 17.7l-1.4 1.4M19.1 4.9l-1.4 1.4"
							/>
						{:else if $theme === 'dark'}
							<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
						{:else}
							<!-- half-filled disc = follow system -->
							<circle cx="12" cy="12" r="9" /><path
								d="M12 3v18a9 9 0 0 0 0-18Z"
								fill="currentColor"
							/>
						{/if}
					</svg>
				</button>
			</li>
		</ul>
	</div>
</nav>
