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

		if ($cartItems.some((item) => item.stock < item.quantity)) {
			alert('Some items are out of stock');
			return;
		}

		if ($cartItems.some((item) => item.quantity <= 0)) {
			alert('Some items have invalid quantity');
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
			<h3 class="text-lg font-bold">Confirm order</h3>
			<div class="py-4 receipt">
				{#each $cartItems as item}
					<div class="receipt-row">
						<p>{item.name}</p>
						<p>{item.quantity} x {item.price}THB</p>
						<p>{item.quantity * item.price}THB</p>
					</div>
				{/each}
			</div>
			<div class="receipt-row">
				<p>Delivery fee</p>
				<p></p>
				<p>35THB</p>
			</div>

			<div class="receipt-row">
				<p>Total</p>
				<p></p>
				<p>
					{($cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0) + 35).toFixed(
						2
					)}THB
				</p>
			</div>

			<div class="modal-action">
				<form method="dialog">
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
				<div class="first">
					<h3>{item.name}</h3>
				</div>

				<div class="second">
					<div class="quantity">
						<button
							class="btn"
							class:btn-disabled={item.quantity <= 0}
							onclick={() => changeQuantity(item.id, -1)}>-</button
						>
						<p>{item.quantity}</p>
						<button
							class="btn"
							class:btn-disabled={item.stock <= item.quantity}
							onclick={() => changeQuantity(item.id, 1)}>+</button
						>
					</div>
					<p>Total: {item.quantity * item.price}</p>
					<button class="remove-btn btn" onclick={() => removeItemFromCart(item.id)}>Remove</button>
				</div>
			</div>
		{/each}
	</div>
</div>

<div class="wrapper hero">
	<h2>Order summary</h2>
</div>

<div class="wrapper">
	{#each $currentOrders as order, index}
		<div tabindex="0" class="collapse collapse-arrow bg-base-100 border-base-300 border">
			<div class="collapse-title font-semibold">Order {index + 1}: {order.status}</div>

			<div class="collapse-content text-sm flex flex-col">
				{#each order.items as item}
					<div class="flex flex-row justify-between">
						<p>{item.name}</p>
						<p>Total: {item.quantity * item.price}</p>
					</div>
				{/each}
			</div>
		</div>
	{/each}
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
		flex-direction: row;
		padding: 1rem;
		background-color: #f9f9f9;
		border-radius: 8px;
		justify-content: space-between;

		.first,
		.second {
			display: flex;
			align-items: center;

			* {
				flex: 1;
			}
		}

		.second {
			justify-self: flex-end;
			gap: 2.5rem;
		}
	}

	.quantity {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.receipt {
		display: flex;
		flex-direction: column;
	}

	.receipt-row {
		display: flex;
		* {
			flex: 1;
			text-align: end;
		}
	}
</style>
