<script lang="ts">
	import type { CartItem } from './../lib/localStores.ts';
	import { db } from '$lib/firebase';
	import { cartItems } from '$lib/localStores';
	import { collectionStore } from 'sveltefire';
	import type { ShopItem } from '$lib/utils';

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
	<label class="input">
		<svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
			<g
				stroke-linejoin="round"
				stroke-linecap="round"
				stroke-width="2.5"
				fill="none"
				stroke="currentColor"
			>
				<circle cx="11" cy="11" r="8"></circle>
				<path d="m21 21-4.3-4.3"></path>
			</g>
		</svg>
		<input type="search" class="grow" placeholder="Search" />
	</label>

	<div class="grid">
		{#each $shopItems as item}
			<div class="card">
				<a href="/item/{item.id}">
					<img class="product-image" src={item.image} alt={item.name} />
				</a>

				<h2>{item.name}</h2>
				<p>{item.description}</p>
				<p>{item.price}THB</p>
				<p>{item.stock} remaining</p>

				<ul>
					{#each item.category as category}
						<li>{category}</li>
					{/each}
				</ul>

				<button
					class="order-btn btn"
					class:btn-disabled={item.stock <=
						($cartItems.find((cartItem) => cartItem.id === item.id)?.quantity || 0)}
					onclick={() => addItemToCart(item.id, item.price, item.name, 1, item.stock)}
					>Add to cart</button
				>
			</div>
		{/each}
	</div>
</main>

{#each allCategories as category}
	<section class="wrapper">
		<h2>{category}</h2>
		<div class="grid">
			{#each items as item}
				{#if item.category.includes(category)}
					<div class="card">
						<a href="/item/{item.id}">
							<img class="product-image" src={item.image} alt={item.name} />
						</a>

						<h2>{item.name}</h2>
						<p>{item.description}</p>
						<p>{item.price}THB</p>
						<p>{item.stock} remaining</p>

						<ul>
							{#each item.category as category}
								<li>{category}</li>
							{/each}
						</ul>

						<button
							class="order-btn btn"
							class:btn-disabled={item.stock <=
								($cartItems.find((cartItem) => cartItem.id === item.id)?.quantity || 0)}
							onclick={() => addItemToCart(item.id, item.price, item.name, 1, item.stock)}
							>Add to cart</button
						>
					</div>
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

		background-color: rgb(44, 96, 217);
	}

	.grid {
		margin-top: 1rem;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 1.5rem;
	}

	.card {
		background-color: white;
		border-radius: 0.5rem;
		padding: 1rem;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.order-btn {
		justify-self: flex-end;
	}

	.product-image {
		max-width: 100%;
		height: auto;

		aspect-ratio: 1 / 1;
		border-radius: 0.5rem;
		object-fit: cover;
	}
</style>
