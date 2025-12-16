<script lang="ts">
	import '../app.css';
	import Nav from '$lib/Nav.svelte';
	import { theme } from '../store';
	import { onMount } from 'svelte';

	onMount(() => {
		// Initialize theme from localStorage or system preference
		const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null;

		if (storedTheme) {
			theme.set(storedTheme);
		}

		// Listen to theme store changes
		const unsubscribe = theme.subscribe((value) => {
			let isDark = false;

			if (value === 'dark') {
				isDark = true;
			} else if (value === 'light') {
				isDark = false;
			} else {
				// System preference
				isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
			}

			if (isDark) {
				document.documentElement.classList.add('dark');
			} else {
				document.documentElement.classList.remove('dark');
			}

			localStorage.setItem('theme', value);
		});

		// Listen to system preference changes
		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
		const handleChange = () => {
			// Only update if theme is set to 'system'
			if (localStorage.getItem('theme') === 'system' || !localStorage.getItem('theme')) {
				const isDark = mediaQuery.matches;
				if (isDark) {
					document.documentElement.classList.add('dark');
				} else {
					document.documentElement.classList.remove('dark');
				}
			}
		};

		mediaQuery.addEventListener('change', handleChange);

		return () => {
			unsubscribe();
			mediaQuery.removeEventListener('change', handleChange);
		};
	});
</script>

<div class="min-h-screen bg-white dark:bg-neutral-900">
	<Nav />

	<slot />

	<!-- Footer -->
	<footer class="border-t border-neutral-200 py-12 dark:border-neutral-800">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="flex flex-col items-center justify-center gap-4">
				<!-- <p class="text-center text-sm text-neutral-600 dark:text-neutral-400">
					Built with <span class="mx-1">❤️</span> by
					<a
						href="https://github.com/ananto30"
						class="font-medium text-neutral-900 hover:text-neutral-700 dark:text-neutral-50 dark:hover:text-neutral-200"
					>
						Azizul
					</a>
				</p> -->
				<div class="flex items-center gap-4 text-xs text-neutral-500 dark:text-neutral-600">
					<span>© 2024</span>
					<span>|</span>
					<a
						href="https://github.com/Ananto30/ask-hadith"
						class="font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-50"
					>
						Ask Hadith
					</a>
				</div>
			</div>
		</div>
	</footer>
</div>
