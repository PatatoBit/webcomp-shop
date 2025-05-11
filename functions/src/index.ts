import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import * as admin from 'firebase-admin';

admin.initializeApp();

export const markStatusSequence = onDocumentCreated(
	{ region: 'asia-southeast1', document: 'orders/{orderId}' },
	async (event) => {
		const snap = event.data;
		if (!snap) return;

		const ref = snap.ref;
		const now = admin.firestore.Timestamp.now();

		await ref.update({
			status: 'delivering',
			updatedAt: now
		});

		await new Promise((resolve) => setTimeout(resolve, 5000));
		await ref.update({
			status: 'delivered',
			updatedAt: admin.firestore.Timestamp.now()
		});
	}
);
