<script lang="ts">
	import { collectionStore } from 'sveltefire';
	import { db } from '$lib/firebase';
	import type { ShopItem } from '$lib/utils.js';
	import { onMount } from 'svelte';

	export let data;
	const { id } = data;
	const shopItems = collectionStore<ShopItem>(db, 'items');
</script>

<main class="wrapper">
	{#each $shopItems as item}
		{#if item.id === id}
			<div class="item-container">
				<div class="image-container">
					<img src={item.image} alt={item.name} />
				</div>

				<div class="details-container">
					<h1>{item.name}</h1>
					<p class="description">{item.description}</p>
					<p class="price">{item.price} ฿</p>
					<p class="stock">Stock: {item.stock} remaining</p>
					<div class="categories">
						{#each item.category as category}
							<span class="category-tag">{category}</span>
						{/each}
					</div>
				</div>
			</div>
		{/if}
	{/each}
</main>

<style lang="scss">
	.wrapper {
		padding: 2rem;
		max-width: 1200px;
		margin: 0 auto;
	}

	.item-container {
		display: grid;
		grid-template-columns: 1fr;
		gap: 2rem;
		background: white;
		border-radius: 12px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		padding: 2rem;
		transition: transform 0.2s ease;

		@media (min-width: 768px) {
			grid-template-columns: 1fr 1fr;
			padding: 3rem;
		}

		&:hover {
			transform: translateY(-2px);
		}
	}

	.image-container {
		display: flex;
		justify-content: center;
		align-items: center;
		background: #f8f9fa;
		border-radius: 8px;
		padding: 1rem;
		overflow: hidden;

		img {
			width: 100%;
			height: auto;
			max-width: 400px;
			object-fit: cover;
			border-radius: 4px;
			transition: transform 0.3s ease;

			&:hover {
				transform: scale(1.02);
			}
		}
	}

	.details-container {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	h1 {
		font-size: 2rem;
		margin: 0;
		color: #2d3748;
		font-weight: 700;
	}

	.description {
		font-size: 1.1rem;
		line-height: 1.6;
		color: #4a5568;
		margin: 0;
	}

	.price {
		font-size: 1.5rem;
		font-weight: 600;
		color: #2d3748;
		margin: 0;
	}

	.stock {
		font-size: 1rem;
		color: #718096;
		margin: 0;
	}

	.categories {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-top: 0.5rem;
	}

	.category-tag {
		background: #edf2f7;
		color: #4a5568;
		padding: 0.5rem 1rem;
		border-radius: 20px;
		font-size: 0.9rem;
		transition: background-color 0.2s ease;

		&:hover {
			background: #e2e8f0;
		}
	}
</style>
