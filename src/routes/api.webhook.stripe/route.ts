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
    /**
     * {
        "id": "prod_O7IdLobf7EZwJr",
        "object": "product",
        "active": true,
        "created": 1687265488,
        "default_price": null,
        "description": "Comfortable gray cotton t-shirt",
        "images": [],
        "livemode": false,
        "metadata": {},
        "name": "T-shirt",
        "package_dimensions": null,
        "shippable": null,
        "statement_descriptor": null,
        "tax_code": null,
        "unit_label": null,
        "updated": 1687265488,
        "url": null
      }
     */
  }
  if (event.type === "product.updated") {
  }
  if (event.type === "product.deleted") {
  }

  return json({});
}
