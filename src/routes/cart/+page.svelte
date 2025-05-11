<script lang="ts">
	import { cartItems } from '$lib/localStores';

	function removeItemFromCart(id: string) {
		cartItems.update((items) => {
			return items.filter((item) => item.id !== id);
		});
	}

	function changeQuantity(id: string, quantity: number) {
		cartItems.update((items) => {
			const item = items.find((item) => item.id === id);
			if (item) {
				item.quantity += quantity;
			}
			return items;
		});
	}
</script>

<header class="wrapper hero">
	<div>
		<h1>Your cart</h1>
		<p>You currently have {$cartItems.length} items in the cart</p>
	</div>

	<button class="btn btn-primary"> Checkout </button>
</header>

<div class="wrapper">
	<div class="list">
		{#each $cartItems as item}
			<div class="list-item">
				<h3>{item.name}</h3>

				<p>Total: {item.quantity * item.price}</p>

				<div class="quantity">
					<button class="btn" onclick={() => changeQuantity(item.id, -1)}>-</button>
					<p>{item.quantity}</p>
					<button
						class="btn"
						class:btn-disabled={item.stock <= item.quantity}
						onclick={() => changeQuantity(item.id, 1)}>+</button
					>
				</div>
				<button class="remove-btn btn" onclick={() => removeItemFromCart(item.id)}>Remove</button>
			</div>
		{/each}
	</div>
</div>

<style lang="scss">
	.hero {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		padding: 2rem;
	}

	.list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.list-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem;
		background-color: #f9f9f9;
		border-radius: 8px;
	}

	.quantity {
		display: flex;
		align-items: center;
		gap: 1rem;
	}
</style>
