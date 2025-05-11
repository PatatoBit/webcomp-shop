<script lang="ts">
	import type { CartItem } from './../lib/localStores.ts';
	import { db } from '$lib/firebase';
	import { cartItems } from '$lib/localStores';
	import { collectionStore } from 'sveltefire';
	import type { ShopItem } from '$lib/utils';

	const shopItem = collectionStore<ShopItem>(db, 'items');

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
		{#each $shopItem as item}
			<div class="card">
				<img src={item.image} alt={item.name} />

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

<style lang="scss">
	.hero {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		padding: 2rem;

		background-color: rgb(44, 96, 217);
	}

	.grid {
		margin-top: 1rem;
		display: grid;
		grid-template-columns: repeat(4, minmax(300px, 1fr));
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
</style>
