<script lang="ts">
	import type { HadithModel } from '../models';

	export let hadith: HadithModel;

	let pbuh = 'ﷺ';
	let narrator = hadith.narrator_en.replaceAll(pbuh, 'PBUH');
	let body = hadith.body_en.replaceAll(pbuh, 'PBUH');
</script>

<div class="flex h-screen">
	<div class="p-8 m-auto">
		{#if hadith.narrator_en}
			<div class="items-center text-xs font-medium text-gray-600 pb-8">
				{narrator}
			</div>
		{/if}
		<div class="font-light font-merriweather text-center text-lg">
			{body}
		</div>
		<div class="items-center font-semibold text-sm text-gray-700 py-8">
			{hadith.collection} Book: {hadith.book_no}, Hadith: {hadith.book_ref_no} (Hadith No: {hadith.hadith_no ??
				'Unknown'})
		</div>
	</div>
</div>

<style>
	div {
		font-family: 'Noto Sans', sans-serif;
		display: flex;
		flex-direction: column;
	}
</style>
