<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import BookmarkSvg from '$lib/svgs/bookmark.svelte';

	import type { HadithModel } from 'src/routes/models';

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
		text +=
			'https://askhadith.com?search=' +
			encodeURIComponent(hadith.collection_id + ' ' + hadith.hadith_no);
		navigator.clipboard.writeText(text);
		copied = true;
		setTimeout(() => {
			copied = false;
		}, 3000);
	};

	const getLocalBookmarkedHadiths = (): HadithModel[] => {
		let hadiths = JSON.parse(localStorage.getItem('bookmarkedHadiths') || '');
		if (!hadiths) {
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

<div in:fade class="max-w-4xl border-b">
	<div class="px-4 py-8">
		<div class="flex flex-row items-center font-semibold">
			<div class="w-full ">
				<h2>{hadith.collection}</h2>
				<span class="flex text-sm text-gray-600">
					Book: {hadith.book_no}, Hadith: {hadith.book_ref_no}
					{#if hadith.hadith_no}
						(Hadith No: {hadith.hadith_no})
					{/if}
				</span>
			</div>
			<button
				class="flex w-5 h-5 ml-2"
				on:click={() => {
					if (bookmarked) unBookmarkHadith();
					else bookmarkHadith();
				}}
			>
				<BookmarkSvg bind:bookmarked />
			</button>
		</div>
		<div class="flex flex-col gap-2 py-2">
			{#if hadith.narrator_en}
				<p class="text-sm font-medium text-gray-500">
					{hadith.narrator_en}
				</p>
			{/if}
			<p class="leading-relaxed antialised">
				{#each hadith.body_en.split(' ') as word}
					{#if hadith.highlight_hits && hadith.highlight_hits.includes(word.replace(/[.,/#!$%^&*;:{}=\-_`~()"']/g, ''))}
						<span class="font-semibold font-merriweather antialised">{word} </span>
					{:else}
						<span class="font-light font-merriweather antialised">{word} </span>
					{/if}
				{/each}
			</p>
		</div>
		<div class="flex">
			<div class="flex flex-col w-full pt-2">
				<!-- <span class="text-xs font-semibold text-gray-600"
					>{hadith.collection} (Book: {hadith.book_no}, Hadith: {hadith.book_ref_no})
					{#if hadith.hadith_no}
						Hadith No: {hadith.hadith_no}
					{/if}
				</span> -->
				<span class="text-xs font-semibold text-gray-500">Book: {hadith.book_en} </span>
				{#if hadith.chapter_en}
					<span class="text-xs font-semibold text-gray-500">Chapter: {hadith.chapter_en}</span>
				{/if}
				<span class="text-xs font-semibold text-gray-500">Grade: {hadith.hadith_grade}</span>
			</div>
			<div class="flex justify-end mt-2">
				<button
					class="px-2 my-auto text-xs font-medium transition duration-200 ease-in-out border border-gray-400 hover:bg-black hover:text-white h-7"
					on:click={copyText}
					style="font-size: .7rem;"
				>
					{copied ? 'Copied' : 'Copy'}
				</button>
			</div>
		</div>
	</div>
</div>
