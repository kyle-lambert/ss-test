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
