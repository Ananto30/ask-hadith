<script lang="ts">
	import type { HadithModel } from 'src/routes/models';

	export let hadith: HadithModel;
</script>

<div class="max-w-4xl py-4">
	<h2 class="text-xl font-bold">{hadith.book_en}</h2>
	<div class="flex flex-col py-2">
		{#if hadith.chapter_en}
			<span class="text-xs font-semibold text-gray-500">Chapter: {hadith.chapter_en}</span>
		{/if}
		<span class="text-xs font-semibold text-gray-600"
			>{hadith.collection} (Book: {hadith.book_no}, Hadith: {hadith.book_ref_no})
			{#if hadith.hadith_no}
				Hadith No: {hadith.hadith_no}
			{/if}
		</span>
	</div>
	<div class="flex flex-col">
		<p class="text-sm font-light font-merriweather">
			{hadith.narrator_en}
		</p>
		<p class="font-light font-merriweather">
			{hadith.body_en}
		</p>
	</div>
	<div class="pt-2">
		<span class="text-xs font-semibold text-gray-500">Grade: {hadith.hadith_grade}</span>
	</div>
</div>
