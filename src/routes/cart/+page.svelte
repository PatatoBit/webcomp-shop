<script lang="ts">
	import { db } from '$lib/firebase';
	import { cartItems } from '$lib/localStores';
	import type { Order } from '$lib/utils';
	import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
	import { collectionStore } from 'sveltefire';

	const currentOrders = collectionStore<Order>(db, 'orders');

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

	async function checkoutCart() {
		const colRef = collection(db, 'orders');

		if ($cartItems.length === 0) {
			alert('Your cart is empty');
			return;
		}

		const docRef = await addDoc(colRef, {
			createdAt: new Date(),
			status: 'paid',
			items: $cartItems
		});

		// Subtract from stock
		$cartItems.forEach(async (item) => {
			const itemRef = doc(db, 'items', item.id);
			await updateDoc(itemRef, {
				stock: item.stock - item.quantity
			});
		});

		cartItems.set([]);
	}
</script>

<header class="wrapper hero">
	<div>
		<h1>Your cart</h1>
		<p>You currently have {$cartItems.length} items in the cart</p>
	</div>

	<button
		class="btn btn-primary"
		onclick={() => (document.getElementById('payment_modal') as HTMLDialogElement)?.showModal()}
		>Checkout</button
	>
	<dialog id="payment_modal" class="modal">
		<div class="modal-box">
			<h3 class="text-lg font-bold">Payment</h3>
			<p class="py-4">
				Your total: {$cartItems
					.map((item) => {
						return item.quantity * item.price;
					})
					.reduce((a, b) => a + b, 0)}
			</p>
			<div class="modal-action">
				<form method="dialog">
					<!-- if there is a button in form, it will close the modal -->
					<button class="btn btn-primary" onclick={async () => await checkoutCart()}>
						Pay now
					</button>
					<button class="btn">Close</button>
				</form>
			</div>
		</div>
	</dialog>
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

<div class="wrapper hero">
	<h2>Order summary</h2>
</div>

<div class="wrapper">
	<div class="list">
		{#each $currentOrders as order}
			{#each order.items as item}
				<div class="list-item">
					<h3>{item.name}</h3>

					<p>Total: {item.quantity * item.price}</p>
				</div>
				<p>Status: {order.status}</p>
			{/each}
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
