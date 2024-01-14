<script lang="ts">
	export let bookmarked: boolean;
</script>

<svg
	class="h-5 w-5"
	xmlns="http://www.w3.org/2000/svg"
	width="192"
	height="192"
	fill="currentColor"
	viewBox="0 0 256 256"
>
	<rect width="256" height="256" fill="none" />
	<path
		d="M192,224l-64.0074-40L64,224V48a8,8,0,0,1,8-8H184a8,8,0,0,1,8,8Z"
		fill={bookmarked ? 'currentColor' : 'none'}
		stroke="currentColor"
		stroke-linecap="round"
		stroke-linejoin="round"
		stroke-width="12"
	/>
</svg>
