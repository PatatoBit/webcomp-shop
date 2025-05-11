import type { CartItem } from './localStores';

export interface ShopItem {
	id: string;
	name: string;
	description: string;
	image: string;
	price: number;
	category: string[];
	stock: number;
}

export interface Order {
	createdAt: string;
	items: CartItem[];
	status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
}
