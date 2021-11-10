<script>
	import { onMount } from 'svelte';

	let deferredPrompt;
	let alreadyInstalled = true;

	const install = async () => {
		if (deferredPrompt !== null) {
			deferredPrompt.prompt();
			const { outcome } = await deferredPrompt.userChoice;
			if (outcome === 'accepted') {
				deferredPrompt = null;
			}
		}
	};

	onMount(() => {
		window.addEventListener('beforeinstallprompt', (e) => {
			deferredPrompt = e;
		});
		if (!window.matchMedia('(display-mode: standalone)').matches) {
			alreadyInstalled = false;
		}
	});
</script>

<nav class="sticky top-0 z-10 p-2 bg-white md:p-4">
	<div class="max-w-6xl mx-auto">
		<ul class="flex flex-row justify-end gap-4 p-2 text-sm font-medium text-gray-600">
			<li>
				<a class="flex flex-row items-center gap-1 hover:underline" href="/">
					<svg
						class="w-4 h-4"
						fill="currentcolor"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
					>
						<path
							d="M16.32 14.9l5.39 5.4a1 1 0 0 1-1.42 1.4l-5.38-5.38a8 8 0 1 1 1.41-1.41zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z"
						/>
					</svg>
					Search
				</a>
			</li>
			<li>
				<a class="flex flex-row items-center gap-1 hover:underline" href="/bookmarks"
					><svg
						class="w-4 h-4"
						xmlns="http://www.w3.org/2000/svg"
						width="192"
						height="192"
						fill="none"
						viewBox="0 0 256 256"
					>
						<path
							d="M168,224l-56.0074-40L56,224V72a8,8,0,0,1,8-8h96a8,8,0,0,1,8,8Z"
							stroke="currentcolor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="20"
						/>
						<path
							d="M88,64V40a8,8,0,0,1,8-8h96a8,8,0,0,1,8,8V192l-32-22.85412"
							stroke="currentcolor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="20"
						/>
					</svg>Bookmarks
				</a>
			</li>
			{#if !alreadyInstalled}
				<li>
					<button
						class="flex flex-row gap-1 items-center font-medium hover:underline"
						on:click={install}
						><svg
							class="w-4 h-4"
							xmlns="http://www.w3.org/2000/svg"
							width="192"
							height="192"
							fill="none"
							viewBox="0 0 256 256"
							><rect width="256" height="256" fill="none" /><polyline
								points="86 110.011 128 152 170 110.011"
								stroke="currentcolor"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="20"
							/><line
								x1="128"
								y1="40"
								x2="128"
								y2="151.97057"
								stroke="currentcolor"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="20"
							/><path
								d="M216,152v56a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V152"
								stroke="currentcolor"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="20"
							/></svg
						>Install</button
					>
				</li>
			{/if}

			<!-- <li>
				<div class="flex flex-col">
					<a class="flex flex-row items-center gap-1 text-gray-300 hover:underline" href="">
						<svg
							class="w-4 h-4 text-gray-300"
							xmlns="http://www.w3.org/2000/svg"
							width="192"
							height="192"
							fill="#D1D5DB"
							viewBox="0 0 256 256"
							><rect width="256" height="256" fill="none" /><rect
								x="40"
								y="40"
								width="48"
								height="176"
								rx="8"
								stroke-width="16"
								stroke="#000000"
								stroke-linecap="round"
								stroke-linejoin="round"
								fill="none"
							/><line
								x1="40"
								y1="80"
								x2="88"
								y2="80"
								fill="none"
								stroke="#000000"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="16"
							/><rect
								x="88"
								y="40"
								width="48"
								height="176"
								rx="8"
								stroke-width="16"
								stroke="#000000"
								stroke-linecap="round"
								stroke-linejoin="round"
								fill="none"
							/><line
								x1="88"
								y1="176"
								x2="136"
								y2="176"
								fill="none"
								stroke="#000000"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="16"
							/><rect
								x="158"
								y="38.58284"
								width="48"
								height="176"
								rx="8"
								transform="matrix(0.96593, -0.25882, 0.25882, 0.96593, -26.56055, 51.41827)"
								stroke-width="16"
								stroke="#000000"
								stroke-linecap="round"
								stroke-linejoin="round"
								fill="none"
							/><line
								x1="171.24109"
								y1="179.15894"
								x2="217.60553"
								y2="166.73563"
								fill="none"
								stroke="#000000"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="16"
							/><line
								x1="146.39447"
								y1="86.43006"
								x2="192.75891"
								y2="74.00675"
								fill="none"
								stroke="#000000"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="16"
							/></svg
						>
						Hadith Books
					</a>
					<p class="text-xs text-gray-300">coming soon*</p>
				</div>
			</li> -->
		</ul>
	</div>
</nav>
