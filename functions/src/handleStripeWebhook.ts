import { onRequest } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';
import Stripe from 'stripe';
import { Request } from 'firebase-functions/v2/https';
import { Response } from 'express';
import { log } from 'firebase-functions/logger';

admin.initializeApp();

const handleWebhook = async (
	req: Request,
	res: Response,
	stripeKey: string | undefined,
	stripeWebhook: string | undefined
) => {
	if (!stripeKey || !stripeWebhook) {
		console.error('Stripe secret key or webhook secret not found');
		res.status(500).send('Server: Stripe secret key or webhook secret not found');
		return;
	}

	const stripe = new Stripe(stripeKey);
	const sig = req.headers['stripe-signature'] as string;
	let event: Stripe.Event;

	try {
		event = stripe.webhooks.constructEvent(req.rawBody, sig, stripeWebhook);
	} catch (err) {
		console.error('⚠️ Webhook signature verification failed.', (err as Error).message);
		res.status(400).send(`Webhook Error: ${(err as Error).message}`);
		return;
	}

	if (event.type === 'checkout.session.completed') {
		const session = event.data.object as Stripe.Checkout.Session;
		const payloadData = JSON.parse(session.metadata?.payloadData as string);

		if (payloadData) {
			try {
				log('Updating document with payload data:', payloadData);
			} catch (error) {
				console.error('Error updating document:', error);
			}
		} else {
			console.error('No payload data received');
		}
	}

	res.status(200).json({ received: true });
};

export const stripeTest = onRequest({ secrets: ['TEST_KEY', 'TEST_WEBHOOK'] }, (req, res) => {
	handleWebhook(req, res, process.env.TEST_KEY, process.env.TEST_WEBHOOK);
});
