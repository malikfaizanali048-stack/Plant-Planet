import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-06-20",
});

// POST /api/checkout — creates a Stripe PaymentIntent for card payments
// (Cash on Delivery orders never hit this route — they go straight to /api/orders)
export async function POST(req: NextRequest) {
  try {
    const { amount } = await req.json(); // amount in PKR

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe expects the smallest currency unit
      currency: "pkr",
      automatic_payment_methods: { enabled: true },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (err: any) {
    console.error("Stripe error:", err);
    return NextResponse.json({ error: err.message || "Payment setup failed" }, { status: 500 });
  }
}
