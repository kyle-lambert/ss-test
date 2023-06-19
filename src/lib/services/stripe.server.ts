import Stripe from "stripe";
import type { Prisma, Tenant } from "@prisma/client";
import { prisma } from "./db.server";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2022-11-15",
  typescript: true,
});

async function updateTenant(
  tenantId: Tenant["id"],
  data: Prisma.TenantUpdateInput
) {
  const result = await prisma.tenant.update({
    where: {
      id: tenantId,
    },
    data,
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
  await updateTenant(tenantId, { stripeCustomerId: stripeCustomer.id });
}
