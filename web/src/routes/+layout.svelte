<script>
	import '../app.css';
	import Nav from '$lib/Nav.svelte';
</script>

<Nav />

<slot />

<!-- to make it fixed bottom "fixed inset-x-0 bottom-0 " -->
<div class="xl:fixed bottom-0 right-0 flex flex-col gap-1 pt-8 pb-8 bg-white xl:mr-8">
	<p class="text-xs font-medium text-center text-gray-500">
		Built with ❤️ by
		<a href="https://github.com/ananto30" class="text-gray-500 hover:underline">Azizul</a>
	</p>
	<p class="text-xs text-center text-gray-500">
		© 2023
		<span class="mx-1">|</span>
		<a href="https://github.com/Ananto30/ask-hadith" class="text-gray-500 hover:underline"
			>Ask Hadith
		</a>
	</p>
</div>
