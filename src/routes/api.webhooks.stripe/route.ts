import { stripe } from "@/lib/services/stripe.server";
import { type ResponseJSON } from "@/lib/utils/http";

import { json, type ActionArgs } from "@remix-run/node";
import { badRequest } from "remix-utils";
import Stripe from "stripe";

export async function action({ request }: ActionArgs) {
  const signature = request.headers.get("stripe-signature") as string;
  const text = await request.text();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  /**
   * Add better typescript support for Stripe.
   * Types returned from Stripe itself are pretty bad, ideally we
   * should type event.type so we can autocomplete on event types.
   */
  try {
    event = stripe.webhooks.constructEvent(text, signature, secret);
  } catch (e) {
    if (e instanceof Stripe.errors.StripeError) {
      return badRequest<ResponseJSON>({
        errors: [
          {
            name: "Webhook Error",
            description: e.message,
          },
        ],
      });
    }
    throw e;
  }

  if (event.type === "product.created") {
    const productCreated = event.data.object;
    console.log("productCreated", JSON.stringify(productCreated, null, 3));
  }
  if (event.type === "product.updated") {
    const productUpdated = event.data.object;
    console.log("productUpdated", JSON.stringify(productUpdated, null, 3));
  }
  if (event.type === "product.deleted") {
    const productDeleted = event.data.object;
    console.log("productDeleted", JSON.stringify(productDeleted, null, 3));
  }

  return json({});
}
