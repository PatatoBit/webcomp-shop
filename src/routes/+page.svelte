<script lang="ts">
	import type { CartItem } from './../lib/localStores.ts';
	import { db } from '$lib/firebase';
	import { cartItems } from '$lib/localStores';
	import { collectionStore } from 'sveltefire';
	import type { ShopItem } from '$lib/utils';
	import ShopCard from '$lib/components/ShopCard.svelte';

	const shopItems = collectionStore<ShopItem>(db, 'items');

	function addItemToCart(id: string, price: number, name: string, quantity: number, stock: number) {
		cartItems.update((items: CartItem[]) => {
			const existingItem = items.find((item) => item.id === id);
			if (existingItem) {
				existingItem.quantity += quantity;
			} else {
				items.push({ id, price, name, quantity, stock });
			}
			return items;
		});
	}

	let items: ShopItem[] = [];
	let allCategories: string[] = [];

	shopItems.subscribe((data) => {
		if (!data) return;
		items = data;
		allCategories = Array.from(new Set(items.flatMap((item) => item.category)));
	});
</script>

<header class="wrapper hero">
	<div>
		<h1>ร้านพี่เชฟ</h1>
		<p>หมูกรอบคั่วพริกเกลือ</p>
	</div>

	<a href="/cart">
		<button class="btn">Cart</button>
	</a>
</header>

<main class="wrapper">
	<div class="grid">
		{#each $shopItems as item}
			<ShopCard {item} />
		{/each}
	</div>
</main>

{#each allCategories as category}
	<br />
	<br />

	<section class="wrapper">
		<h2>{category}</h2>
		<div class="grid">
			{#each items as item}
				{#if item.category.includes(category)}
					<ShopCard {item} />
				{/if}
			{/each}
		</div>
	</section>
{/each}

<style lang="scss">
	.hero {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		padding: 2rem;
		flex-wrap: wrap;
		background-color: rgb(221, 184, 18);
	}

	.grid {
		margin-top: 1rem;
		display: grid;
		grid-template-columns: repeat(4, minmax(250px, 250px));
		gap: 1.5rem;
	}
</style>
