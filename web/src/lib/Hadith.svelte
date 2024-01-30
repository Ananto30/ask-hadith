<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, slide } from 'svelte/transition';
	import BookmarkSvg from '$lib/svgs/bookmark.svelte';
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

<div
	transition:slide
	class="max-w-4xl space-y-2 bg-white p-4 shadow dark:bg-storm-600 md:rounded-lg md:p-6"
>
	<div class="flex flex-row items-center">
		<div class="w-full dark:text-gray-300">
			<h2 class="leading-tight">{hadith.collection}</h2>
			<span class="flex text-xs text-gray-600 dark:text-gray-400">
				Book: {hadith.book_no}, Hadith: {hadith.book_ref_no}
				{#if hadith.hadith_no}
					(Hadith No: {hadith.hadith_no})
				{/if}
			</span>
		</div>
		<button
			aria-label="Bookmark Hadith"
			class="ml-2 flex h-5 w-5"
			on:click={() => {
				if (bookmarked) unBookmarkHadith();
				else bookmarkHadith();
			}}
		>
			<BookmarkSvg bind:bookmarked />
		</button>
	</div>
	<div class="text-md flex flex-col gap-2 py-2">
		{#if hadith.narrator_en}
			<p class="text-sm text-gray-500 dark:text-gray-400">
				{hadith.narrator_en}
			</p>
		{/if}
		<p class="font-serif dark:text-gray-300">
			{#each hadith.body_en.split(' ') as word}
				{#if hadith.highlights && hadith.highlights.includes(word.replace(/[.,/#!$%^&*;:{}=\-_`~()"']/g, ''))}
					<span class="font-bold text-emerald-600">{word} </span>
				{:else}
					<span class="">{word} </span>
				{/if}
			{/each}
		</p>
	</div>
	<div class="flex space-x-2">
		<div class="flex w-full flex-col pt-2 text-xs text-gray-500 dark:text-gray-400">
			<span>Book: {hadith.book_en} </span>
			<p class="">
				{#if hadith.chapter_en}
					Chapter:
					{#each hadith.chapter_en.split(' ') as word}
						{#if hadith.highlights && hadith.highlights.includes(word.replace(/[.,/#!$%^&*;:{}=\-_`~()"']/g, ''))}
							<span class="font-bold text-emerald-600">{word} </span>
						{:else}
							<span class="">{word} </span>
						{/if}
					{/each}
				{/if}
			</p>
			<p class="">
				<span>Grade: {hadith.hadith_grade || 'Unknown'}</span>
			</p>
		</div>
		<div class="mt-2 flex justify-end">
			<button
				aria-label="Copy Hadith"
				class="my-auto h-7 rounded-lg border border-gray-300 px-2 text-xs text-gray-600 transition duration-200 ease-in-out hover:bg-gray-800 hover:text-white dark:border-gray-700 dark:bg-storm-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-200"
				on:click={copyText}
			>
				{copied ? 'Copied' : 'Copy'}
			</button>
		</div>
	</div>
</div>
