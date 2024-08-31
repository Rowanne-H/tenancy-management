import { useState } from "react";

export const ENDPOINTS = {
  users: "/users/",
  owners: "/owners/",
  properties: "/properties/",
  tenants: "/tenants/",
  rentals: "/rentals/",
  expenses: "/expenses/",
};

export const FIELD_MAPPINGS = {
  users: ["id", "name", "email", "mobile", "is_accounts"],
  owners: [
    "id",
    "ref",
    "name",
    "email",
    "mobile",
    "address",
    "note",
    "management_start_date",
    "management_end_date",
    "is_active",
  ],
  properties: [
    "id",
    "ref",
    "address",
    "commission",
    "letting_fee",
    "user_id",
    "owner_id",
    "is_active",
  ],
  tenants: [
    "id",
    "ref",
    "name",
    "email",
    "mobile",
    "note",
    "lease_term",
    "lease_start_date",
    "lease_end_date",
    "rent",
    "vacating_date",
    "property_id",
    "is_active",
  ],
  rentals: [
    "id",
    "amount",
    "created_at",
    "payment_date",
    "description",
    "tenant_id",
  ],
  expenses: [
    "id",
    "amount",
    "created_at",
    "payment_date",
    "description",
    "tenant_id",
  ],
};

