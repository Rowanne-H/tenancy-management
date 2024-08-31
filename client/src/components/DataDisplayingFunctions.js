import { useState } from "react";

export const formatValue = (field, value) => {
  if (field === "is_accounts" || field === "is_active") {
    return value ? "Yes" : "No";
  }
  if (!value) {
    return "null";
  }
  if (
    field === "created_at" ||
    field === "payment_date" ||
    field === "management_end_date" ||
    field === "management_start_date" ||
    field === "lease_start_date" ||
    field === "lease_end_date"
  ) {
    const date = new Date(value).toISOString().split("T")[0];
    return date;
  }
  return value;
};