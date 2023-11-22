<script lang="ts">
	import type { SvelteHTMLElements } from 'svelte/elements';

	export let as: keyof SvelteHTMLElements = 'div';
</script>

<svelte:element this={as} class="container"><slot /></svelte:element>

<style>
	.container:not(:focus):not(:active) {
		clip: rect(0 0 0 0);
		clip-path: inset(50%);
		height: 1px;
		overflow: hidden;
		position: absolute;
		white-space: nowrap;
		width: 1px;
	}
</style>
