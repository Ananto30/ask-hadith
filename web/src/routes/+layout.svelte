<script>
	import '../app.css';
	import Nav from '$lib/Nav.svelte';
</script>

<Nav />

<slot />

<div class="flex flex-col gap-1 mt-8 mb-8">
	<p class="text-xs font-medium text-center text-gray-500">
		Built with ❤️ by
		<a href="https://github.com/ananto30" class="text-gray-500 hover:underline">Ananto </a>
	</p>
	<p class="text-xs text-center text-gray-500">
		<a href="https://www.patreon.com/ananto" class="font-medium text-gray-500 hover:underline"
			>Support this project
		</a>
	</p>
	<p class="text-xs text-center text-gray-500">
		© 2021
		<span class="mx-1">|</span>
		<a href="https://github.com/Ananto30/ask-hadith" class="text-gray-500 hover:underline"
			>Ask Hadith
		</a>
	</p>
</div>
