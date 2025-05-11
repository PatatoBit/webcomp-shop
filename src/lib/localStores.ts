// src/lib/stores/cart.ts
import { writable } from 'svelte/store';

export type CartItem = {
	id: string;
	name: string;
	quantity: number;
	price: number;
	stock: number;
};

const isClient = typeof window !== 'undefined';

let initialCart: CartItem[] = [];

if (isClient) {
	const stored = localStorage.getItem('cartItems');
	if (stored) {
		try {
			initialCart = JSON.parse(stored);
		} catch (e) {
			console.error('Invalid cartItems in localStorage');
		}
	}
}

export const cartItems = writable<CartItem[]>(initialCart);

// Sync changes to localStorage (client only)
if (isClient) {
	cartItems.subscribe((items) => {
		localStorage.setItem('cartItems', JSON.stringify(items));
	});
}
