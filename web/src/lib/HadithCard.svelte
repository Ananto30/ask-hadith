<!-- Mainly used to generate an og image -->

<script lang="ts">
	import type { HadithModel } from '../models';

	export let hadith: HadithModel;

	let pbuh = 'ﷺ';
	let narrator = hadith.narrator_en.replaceAll(pbuh, 'PBUH');
	let body = hadith.body_en.replaceAll(pbuh, 'PBUH');
</script>

<div class="flex h-screen">
	<div class="m-auto p-8">
		{#if hadith.narrator_en}
			<div class="items-center pb-8 text-gray-600">
				{narrator}
			</div>
		{/if}
		<div class="text-center font-serif text-2xl font-light">
			{body}
		</div>
		<div class="items-center py-8 font-semibold text-gray-700">
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
