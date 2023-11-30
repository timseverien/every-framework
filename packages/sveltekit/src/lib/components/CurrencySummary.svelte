<script lang="ts">
	import Card from './Card.svelte';
	import Heading, { type HeadingLevel } from './Heading.svelte';

	export let currency: string;
	export let price: number;
	export let headingLevel: HeadingLevel = 2;
</script>

<Card>
	<Heading level={headingLevel}>{currency}</Heading>
	{price}
</Card>
