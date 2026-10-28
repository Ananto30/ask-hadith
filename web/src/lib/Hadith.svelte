<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import type { HadithModel } from '../models';
	import { searchKey } from '../store';

	export let hadith: HadithModel;

	let copied = false;
	let bookmarked = false;

	const copyText = () => {
		let text = '';
		if (hadith.hadith_no) {
			text += hadith.narrator_en + '\n';
		}
		text +=
			hadith.body_en +
			'\n' +
			'\n' +
			hadith.collection +
			' (Book: ' +
			hadith.book_no +
			', Hadith: ' +
			hadith.book_ref_no +
			') ';
		if (hadith.hadith_no) {
			text += 'Hadith No: ' + hadith.hadith_no;
		}
		text += '\n' + 'Book:' + hadith.book_en + '\n';
		if (hadith.chapter_en) {
			text += 'Chapter:' + hadith.chapter_en + '\n';
		}
		if (hadith.hadith_grade) {
			text += 'Grade:' + hadith.hadith_grade + '\n';
		}

		const urlEncodedSearchKey = encodeURIComponent($searchKey);

		text += `https://askhadith.com/book?collection_id=${hadith.collection_id}&book=${hadith.book_no}&ref_no=${hadith.book_ref_no}&search_key=${urlEncodedSearchKey}`;

		navigator.clipboard.writeText(text);
		copied = true;
		setTimeout(() => {
			copied = false;
		}, 3000);
	};

	const getLocalBookmarkedHadiths = (): HadithModel[] => {
		let hadiths = JSON.parse(localStorage.getItem('bookmarkedHadiths') || '[]');
		if (!hadiths || !Array.isArray(hadiths) || hadiths.length === 0) {
			hadiths = [];
		}
		return hadiths;
	};

	const bookmarkHadith = () => {
		let hadiths = getLocalBookmarkedHadiths();
		hadiths.push(hadith);
		localStorage.setItem('bookmarkedHadiths', JSON.stringify(hadiths));
		bookmarked = true;
	};

	const unBookmarkHadith = () => {
		let hadiths = getLocalBookmarkedHadiths();
		for (let i = 0; i < hadiths.length; i++) {
			if (
				hadiths[i].book_no === hadith.book_no &&
				hadiths[i].book_ref_no === hadith.book_ref_no &&
				hadiths[i].collection_id === hadith.collection_id
			) {
				hadiths.splice(i, 1);
				break;
			}
		}
		localStorage.setItem('bookmarkedHadiths', JSON.stringify(hadiths));
		bookmarked = false;
	};

	const isBookmarked = (): boolean => {
		let hadiths = getLocalBookmarkedHadiths();
		for (let i = 0; i < hadiths.length; i++) {
			if (
				hadiths[i].book_no === hadith.book_no &&
				hadiths[i].book_ref_no === hadith.book_ref_no &&
				hadiths[i].collection_id === hadith.collection_id
			) {
				return true;
			}
		}
		return false;
	};

	onMount(() => {
		bookmarked = isBookmarked();
	});
</script>

<article class="py-10 first:pt-8">
	<header class="flex items-start justify-between gap-4">
		<div class="min-w-0 text-sm">
			<p class="font-medium">
				{hadith.collection}
				{#if hadith.hadith_no}
					<span class="text-muted ml-1 font-mono text-xs tabular-nums">#{hadith.hadith_no}</span>
				{/if}
			</p>
			<p class="text-muted mt-0.5 truncate" title={hadith.book_en}>
				{hadith.book_en}
				{#if hadith.book_no || hadith.book_ref_no}
					<span class="ml-1 font-mono text-xs tabular-nums"
						>{hadith.book_no}:{hadith.book_ref_no}</span
					>
				{/if}
			</p>
		</div>
		<div class="-mt-1.5 -mr-2 flex shrink-0">
			<button
				aria-label={copied ? 'Copied to clipboard' : 'Copy hadith'}
				class="text-muted hover:text-ink hover:bg-wash flex h-9 w-9 cursor-pointer items-center justify-center rounded-md transition-colors"
				on:click={copyText}
			>
				<svg
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
					><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path
						d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"
					/></svg
				>
			</button>
			<button
				aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
				aria-pressed={bookmarked}
				class="text-muted hover:text-ink hover:bg-wash flex h-9 w-9 cursor-pointer items-center justify-center rounded-md transition-colors"
				on:click={() => (bookmarked ? unBookmarkHadith() : bookmarkHadith())}
			>
				<svg
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill={bookmarked ? 'currentColor' : 'none'}
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" /></svg
				>
			</button>
		</div>
	</header>

	<div class="mt-6 max-w-[68ch] font-serif">
		{#if hadith.narrator_en}
			<p class="text-ink-2 mb-3 italic">{hadith.narrator_en}</p>
		{/if}
		<p class="text-[1.0625rem] leading-[1.8] text-pretty sm:text-lg">
			{#each hadith.body_en.split(' ') as word}
				{#if hadith.highlights && hadith.highlights.includes(word.replace(/[.,/#!$%^&*;:{}=\-_`~()"']/g, ''))}
					<mark>{word}</mark>
				{:else}
					{word}
				{/if}
				{' '}
			{/each}
		</p>
	</div>

	{#if hadith.chapter_en || hadith.hadith_grade}
		<footer class="text-muted mt-6 space-y-1 text-sm leading-relaxed">
			{#if hadith.chapter_en}
				<p><span class="text-ink-2">Chapter:</span> {hadith.chapter_en}</p>
			{/if}
			{#if hadith.hadith_grade}
				<p><span class="text-ink-2">Grade:</span> {hadith.hadith_grade}</p>
			{/if}
		</footer>
	{/if}

	{#if copied}
		<div
			transition:fade={{ duration: 150 }}
			role="status"
			class="bg-ink text-paper fixed top-18 left-1/2 z-50 -translate-x-1/2 rounded-md px-4 py-2 text-sm shadow-[0_4px_16px_rgb(0_0_0/0.18)]"
		>
			Copied to clipboard
		</div>
	{/if}
</article>
