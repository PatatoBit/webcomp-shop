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

		<img
			class="cheffy"
			src="https://media.discordapp.net/attachments/1079020349041156167/1371025980700758046/B2q5s3ex6KSgAAAAAElFTkSuQmCC.png?ex=6821a2f2&is=68205172&hm=35dc69d49df4a624494986e6cc39a9243ba6223e675546e342b4ee081637dccc&=&format=webp&quality=lossless&width=770&height=741"
			alt=""
		/>
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
		position: relative;
		flex-direction: row;
		justify-content: space-between;
		padding: 2rem;
		padding-left: 5rem;
		flex-wrap: wrap;
		background-color: rgb(221, 184, 18);

		border-radius: 1rem;
		overflow: hidden;
	}

	.cheffy {
		position: absolute;
		width: 120px;
		height: 120px;

		bottom: 0;
		left: 0;
		z-index: 1;
	}

	.grid {
		margin-top: 1rem;
		display: grid;
		grid-template-columns: repeat(4, minmax(250px, 250px));
		gap: 1.5rem;
	}
</style>
