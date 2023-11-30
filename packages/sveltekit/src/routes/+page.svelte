<script lang="ts">
	import CurrencySummary from '$lib/components/CurrencySummary.svelte';
	import { currencyPrices, watchlist } from '$lib/data/finance';
	import { CURRENCIES } from '@ef/api/data';
	import { onMount } from 'svelte';

	onMount(() => {
		currencyPrices.load();
	});

	$: priceStoreMap = Object.fromEntries(
		$currencyPrices.map(({ currency, price }) => [currency, price]),
	);
</script>

{#await watchlist.load() then}
	<h2>Watchlist</h2>
	{#each $watchlist as currency}
		<CurrencySummary {currency} price={priceStoreMap[currency] ?? 0} headingLevel={3} />
	{/each}
{/await}

{#each CURRENCIES as currency}
	<CurrencySummary {currency} price={priceStoreMap[currency] ?? 0} />
{/each}
