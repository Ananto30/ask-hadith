<script>
	import '../app.css';
	import Nav from '$lib/Nav.svelte';
</script>

<div class="min-h-screen bg-slate-50 dark:bg-gray-900">
	<Nav />

	<slot />

	<!-- to make it fixed bottom "fixed inset-x-0 bottom-0 " -->
	<div class="right-0 bottom-0 flex flex-col gap-1 pt-8 pb-8 xl:fixed xl:mr-8 dark:text-gray-300">
		<p class="text-center text-xs font-medium text-gray-500">
			Built with ❤️ by
			<a
				href="https://github.com/ananto30"
				class="text-gray-500 hover:underline dark:hover:text-gray-200"
			>
				Azizul
			</a>
		</p>
		<p class="text-center text-xs text-gray-500">
			© 2024
			<span class="mx-1">|</span>
			<a
				href="https://github.com/Ananto30/ask-hadith"
				class="text-gray-500 hover:underline dark:hover:text-gray-200"
			>
				Ask Hadith
			</a>
		</p>
	</div>
</div>
