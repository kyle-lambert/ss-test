import { stripe } from "@/lib/services/stripe.server";
import { Response, type ErrorResponse } from "@/lib/utils/http";

import { json, type ActionArgs } from "@remix-run/node";
import { badRequest } from "remix-utils";
import Stripe from "stripe";

const relevantEvents = new Set([
  "product.created",
  "product.updated",
  "price.created",
  "price.updated",
]);

export async function action({ request }: ActionArgs) {
  const signature = request.headers.get("stripe-signature") as string;
  const text = await request.text();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(text, signature, secret);
  } catch (error) {
    if (error instanceof Stripe.errors.StripeError) {
      return badRequest<ErrorResponse>({
        error: {
          name: "Stripe webhook constructEvent error",
          description: "Check Stripe webhook logs",
        },
      });
    }
    throw error;
  }

  if (relevantEvents.has(event.type)) {
    try {
      switch (event.type) {
        case "product.created":
        case "product.prices": {
          const eventData = event.data.object as Stripe.Product;
          break;
        }
        case "prices.created":
        case "prices.prices": {
          const eventData = event.data.object as Stripe.Price;
          break;
        }
        default: {
          throw new Error("Unhandled Srtipe webhook event");
        }
      }
    } catch (error) {
      return badRequest<ErrorResponse>({
        error: {
          name: "Stripe webhook event handler failed",
          description: "Check Stripe webhook logs",
        },
      });
    }
  }
  return json<Response>({
    message: {
      name: "Stripe webhook recieved",
    },
  });
}
