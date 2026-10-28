<script lang="ts">
	import '../app.css';
	import Nav from '#lib/Nav.svelte';
	import { theme } from '../store';
	import { onMount } from 'svelte';

	onMount(() => {
		const mq = window.matchMedia('(prefers-color-scheme: dark)');
		theme.set((localStorage.getItem('theme') as 'light' | 'dark' | 'system') || 'system');

		let current: string;
		const apply = () =>
			document.documentElement.classList.toggle(
				'dark',
				current === 'dark' || (current === 'system' && mq.matches)
			);

		const unsubscribe = theme.subscribe((value) => {
			current = value;
			localStorage.setItem('theme', value);
			apply();
		});
		mq.addEventListener('change', apply);

		return () => {
			unsubscribe();
			mq.removeEventListener('change', apply);
		};
	});
</script>

<div class="flex min-h-dvh flex-col">
	<Nav />

	<main class="flex-1">
		<slot />
	</main>

	<footer class="border-line border-t">
		<div
			class="text-muted mx-auto flex max-w-3xl items-center justify-between px-5 py-8 text-xs sm:px-8"
		>
			<span>© 2024 Ask Hadith</span>
			<a href="https://github.com/Ananto30/ask-hadith" class="hover:text-ink hover:underline">
				Source on GitHub
			</a>
		</div>
	</footer>
</div>
