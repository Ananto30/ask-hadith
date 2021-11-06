<script>
	import { fade } from 'svelte/transition';

	export let hadith;
	let copied = false;

	const copyText = () => {
		let text =
			hadith.narrator_en +
			'\n' +
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
		navigator.clipboard.writeText(text);
		copied = true;
		setTimeout(() => {
			copied = false;
		}, 3000);
	};
</script>

<div in:fade class="max-w-4xl border-b">
	<div class="px-2 py-8 md:px-4">
		<h2 class="font-semibold ">
			{hadith.collection}
			<span class="text-gray-600 font-base"
				>(Book: {hadith.book_no}, Hadith: {hadith.book_ref_no})
				{#if hadith.hadith_no}
					Hadith No: {hadith.hadith_no}
				{/if}</span
			>
		</h2>
		<div class="flex flex-col gap-2 py-2">
			<p class="text-sm font-medium text-gray-500">
				{hadith.narrator_en}
			</p>
			<p class="leading-relaxed antialised">
				{#each hadith.body_en.split(' ') as word}
					{#if hadith.highlight_hits.includes(word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ''))}
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
