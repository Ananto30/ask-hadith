<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, slide } from 'svelte/transition';
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

<article
	transition:slide
	class="space-y-6 rounded-xl border border-neutral-200 bg-white p-4 text-neutral-900 shadow-sm hover:shadow-md md:p-6 dark:border-neutral-800 dark:bg-neutral-800/50 dark:text-neutral-50"
>
	<!-- Card Header -->
	<div class="flex flex-col">
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-3">
				<div class="text-md font-semibold dark:text-neutral-300">
					{hadith.collection}
				</div>
				{#if hadith.hadith_no}
					<div
						class="rounded-md border border-neutral-200 px-2 py-0.5 text-xs font-medium text-neutral-600 dark:border-neutral-700 dark:text-neutral-400"
					>
						{hadith.hadith_no}
					</div>
				{/if}
			</div>
			<div class="flex items-center">
				<button
					aria-label={copied ? 'Copied to clipboard' : 'Copy hadith'}
					class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md text-neutral-400 transition-all hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300"
					on:click={copyText}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="18"
						height="18"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="lucide lucide-copy-icon lucide-copy"
						><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path
							d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"
						/></svg
					>
				</button>
				<button
					aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
					class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md text-neutral-400 transition-all hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300"
					on:click={() => {
						if (bookmarked) unBookmarkHadith();
						else bookmarkHadith();
					}}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="18"
						height="18"
						viewBox="0 0 24 24"
						fill={bookmarked ? 'currentColor' : 'none'}
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="lucide lucide-bookmark-icon lucide-bookmark"
						><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" /></svg
					>
				</button>
			</div>
		</div>
		<div class="text-sm text-neutral-500 dark:text-neutral-400" title={hadith.book_en}>
			<span class="font-medium">{hadith.book_en}</span>
			{#if hadith.book_no || hadith.book_ref_no}
				|
				<span class="font-semibold"> B:{hadith.book_no} - H:{hadith.book_ref_no}</span>
			{/if}
		</div>
	</div>

	<!-- Card Content -->
	<div class="space-y-2">
		<!-- Narrator -->
		{#if hadith.narrator_en}
			<div class="text-sm text-neutral-500 italic dark:text-neutral-500">
				{hadith.narrator_en}
			</div>
		{/if}

		<!-- Main Hadith Text -->
		<div class="text-sm leading-relaxed text-neutral-800 dark:text-neutral-200">
			{#each hadith.body_en.split(' ') as word}
				{#if hadith.highlights && hadith.highlights.includes(word.replace(/[.,/#!$%^&*;:{}=\-_`~()"']/g, ''))}
					<span
						class="text-foreground rounded-sm bg-yellow-100 px-1 font-semibold dark:bg-yellow-900/30 dark:text-yellow-200"
						>{word}</span
					>
				{:else}
					<span>{word}</span>
				{/if}
				{' '}
			{/each}
		</div>
	</div>

	<!-- Metadata -->
	<div class="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
		{#if hadith.chapter_en}
			<div><strong>Chapter:</strong> {hadith.chapter_en}</div>
		{/if}
		{#if hadith.hadith_grade}
			<div>
				<!-- <strong>Grade:</strong> -->
				<span
					class="inline-flex items-center rounded-md border border-neutral-200 px-2 py-1 text-xs text-neutral-600 dark:border-neutral-700 dark:text-neutral-400"
					>{hadith.hadith_grade}</span
				>
			</div>
		{/if}
	</div>

	{#if copied}
		<div
			transition:fade
			class="fixed top-14 left-1/2 z-50 -translate-x-1/2 rounded-md bg-green-500 px-4 py-2 text-sm font-medium text-white shadow-lg"
		>
			Hadith copied!
		</div>
	{/if}
</article>
