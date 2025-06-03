import Stripe from "stripe"

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

export const STRIPE_CONFIG = {
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
  currency: "eur",
  plans: {
    standard: {
      price: 488, // 4.88 EUR in cents
      name: "Standard Plan",
    },
    premium: {
      price: 988, // 9.88 EUR in cents
      name: "Premium Plan",
    },
    pro: {
      price: 1988, // 19.88 EUR in cents
      name: "Pro Plan",
    },
  },
}
