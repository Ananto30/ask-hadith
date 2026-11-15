<script lang="ts">
	import { fade } from 'svelte/transition';
	import { COLLECTIONS } from '#lib/site.ts';
</script>

<svelte:head>
	<title>Hadith Collections: Bukhari, Muslim, Abu Dawud, Tirmidhi, Nasa'i, Ibn Majah</title>
	<meta
		name="description"
		content="Browse the six major hadith collections in English, book by book: Sahih al-Bukhari, Sahih Muslim, Sunan Abi Dawud, Jami` at-Tirmidhi, Sunan an-Nasa'i and Sunan Ibn Majah."
	/>
</svelte:head>

<div in:fade class="mx-auto max-w-3xl px-5 sm:px-8">
	<header class="border-line border-b pt-16 pb-8 sm:pt-20">
		<h1 class="font-serif text-4xl font-medium tracking-[-0.02em] text-balance">
			Hadith collections
		</h1>
		<p class="text-muted mt-3 max-w-[60ch] text-sm leading-relaxed">
			Pick a collection to browse its books and read every hadith.
		</p>
	</header>

	<ul class="divide-line divide-y pb-24">
		{#each COLLECTIONS as c}
			<li>
				<a
					href="/hadith/{c.id}"
					class="hover:text-ink block py-5 font-serif text-xl no-underline hover:underline"
				>
					{c.name}
				</a>
			</li>
		{/each}
	</ul>
</div>
