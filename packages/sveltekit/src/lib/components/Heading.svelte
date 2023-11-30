<script lang="ts" context="module">
	export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
</script>

<script lang="ts">
	export let level: HeadingLevel;
	$: element = `h${level}`;
</script>

<svelte:element this={element}><slot /></svelte:element>
