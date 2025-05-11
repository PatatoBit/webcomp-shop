<script lang="ts">
	import { collectionStore } from 'sveltefire';
	import { db } from '$lib/firebase';
	import type { ShopItem } from '$lib/utils.js';
	import { onMount } from 'svelte';

	export let data;
	const { id } = data;
	const shopItems = collectionStore<ShopItem>(db, 'items');
</script>

<main class="wrapper">
	{#each $shopItems as item}
		{#if item.id === id}
			<div>
				<img src={item.image} alt={item.name} />
			</div>

			<div>
				<h1>{item.name}</h1>
				<p>{item.description}</p>
				<p>{item.price}THB</p>
				<p>{item.stock} remaining</p>
				<ul>
					{#each item.category as category}
						<li>{category}</li>
					{/each}
				</ul>
			</div>
		{/if}
	{/each}
</main>

<style lang="scss">
	.wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	img {
		width: 100%;
		max-width: 400px;
	}

	h1 {
		font-size: 2rem;
		margin-bottom: 1rem;
	}

	p {
		margin-bottom: 0.5rem;
	}

	ul {
		list-style-type: none;
		padding: 0;
	}
</style>
