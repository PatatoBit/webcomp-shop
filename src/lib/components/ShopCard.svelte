<script lang="ts">
	import type { CartItem } from '../localStores';
	import { cartItems } from '../localStores';
	import type { ShopItem } from '../utils';

	export let item: ShopItem;

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

<div class="card">
	<a href="/item/{item.id}">
		<img class="product-image" src={item.image} alt={item.name} />
	</a>

	<div class="card-content">
		<h3>{item.name}</h3>
		<div class="price-stock">
			<p class="price">{item.price}THB</p>
			<p class="stock">{item.stock} remaining</p>
		</div>

		<div class="categories">
			{#each item.category as category}
				<span class="category-tag">{category}</span>
			{/each}
		</div>

		<button
			class="order-btn btn"
			class:btn-disabled={item.stock <= ($cartItems.find((cartItem) => cartItem.id === item.id)?.quantity || 0)}
			onclick={() => addItemToCart(item.id, item.price, item.name, 1, item.stock)}
			>Add to cart</button
		>
	</div>
</div>

<style lang="scss">
	.card {
		background-color: white;
		border-radius: 0.5rem;
		padding: 1rem;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		display: flex;
		flex-direction: column;
		height: 100%;
	}

	.card-content {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin-top: 1rem;
	}

	.product-image {
		width: 100%;
		aspect-ratio: 1 / 1;
		border-radius: 0.5rem;
		object-fit: cover;
	}

	.price-stock {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.price {
		font-weight: bold;
		color: #2c3e50;
	}

	.stock {
		color: #666;
		font-size: 0.9rem;
	}

	.categories {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.category-tag {
		background-color: #f0f0f0;
		padding: 0.25rem 0.5rem;
		border-radius: 1rem;
		font-size: 0.8rem;
		color: #666;
	}

	.order-btn {
		margin-top: auto;
		width: 100%;
	}
</style> 