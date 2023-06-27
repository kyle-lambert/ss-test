import Stripe from "stripe";
import type { Tenant } from "@prisma/client";
import { prisma } from "./db.server";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2022-11-15",
  typescript: true,
});

async function assignStripeCustomerToTenant(
  tenantId: Tenant["id"],
  stripeCustomerId: Tenant["stripeCustomerId"]
) {
  const result = await prisma.tenant.update({
    where: {
      id: tenantId,
    },
    data: {
      stripeCustomerId,
    },
  });
  return result;
}

async function createStripeCustomer({
  tenantId,
  tenantName,
}: {
  tenantId: Tenant["id"];
  tenantName: Tenant["name"];
}) {
  const result = await stripe.customers.create({
    name: tenantName,
    metadata: {
      tenantId,
    },
  });
  return result;
}

export async function createAndAssignStripeCustomer({
  tenantId,
  tenantName,
}: {
  tenantId: Tenant["id"];
  tenantName: Tenant["name"];
}) {
  const stripeCustomer = await createStripeCustomer({ tenantId, tenantName });
  await assignStripeCustomerToTenant(tenantId, stripeCustomer.id);
}

/**
 * Stripe webhook handlers
 */
export async function handleProductChange(productData: Stripe.Product) {
  const result = await prisma.product.upsert({
    create: {
      stripeId: productData.id,
      name: productData.name,
      description: productData.description,
      active: productData.active,
    },
    update: {
      name: productData.name,
      description: productData.description,
      active: productData.active,
    },
    where: {
      stripeId: productData.id,
    },
  });
  return result;
}

export async function handlePriceChange(priceData: Stripe.Price) {
  const result = await prisma.price.upsert({
    create: {
      stripeId: priceData.id,
      unitAmount: priceData.unit_amount,
      currency: priceData.currency,
      type: priceData.type,
      active: priceData.active,
      billionScheme: priceData.billing_scheme,
      interval: priceData.recurring?.interval,
      intervalCount: priceData.recurring?.interval_count,
      product: {
        connect: {
          stripeId:
            typeof priceData.product === "string" ? priceData.product : "",
        },
      },
    },
    update: {},
    where: {
      stripeId: priceData.id,
    },
  });
  return result;
}
