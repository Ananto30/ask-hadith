<script lang="ts">
	export let bookmarked: boolean;
</script>

<svg
	class="w-5 h-5"
	xmlns="http://www.w3.org/2000/svg"
	width="192"
	height="192"
	fill="#000000"
	viewBox="0 0 256 256"
>
	<rect width="256" height="256" fill="none" />
	<path
		d="M192,224l-64.0074-40L64,224V48a8,8,0,0,1,8-8H184a8,8,0,0,1,8,8Z"
		fill={bookmarked ? '#000000' : 'none'}
		stroke="#000000"
		stroke-linecap="round"
		stroke-linejoin="round"
		stroke-width="12"
	/>
</svg>
