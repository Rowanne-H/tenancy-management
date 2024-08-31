export const isDate = (field) => {
  if (
    field === "created_at" ||
    field === "payment_date" ||
    field === "management_end_date" ||
    field === "management_start_date" ||
    field === "lease_start_date" ||
    field === "lease_end_date"
  ) {
    return true;
  }
  return false;
}

export const formatValue = (field, value) => {
  if (field === "is_accounts" || field === "is_active") {
    return value ? "Yes" : "No";
  }
  if (!value) {
    return "null";
  }
  if (isDate(field)) {
    return getDate(value)
  }
  return value;
};

export const generateInitialValue = (field, value) => {
  if (field === "is_accounts" && !value) {
    return false;
  }
  if (field === "is_active" && !value) {
    return true;
  }
  if (isDate(field)) {
    return getDate(value)
  }
  return value;
};

export const getDate = (value) => {
  if (!value) {return null}
  const date = new Date(value).toISOString().split("T")[0];
  return date;
};

export const inputType = (field) => {
  if (field === "password") {
    return "password";
  }
  if (
    field === "created_at" ||
    field === "payment_date" ||
    field === "management_end_date" ||
    field === "management_start_date" ||
    field === "lease_start_date" ||
    field === "lease_end_date"
  ) {
    return "date";
  }
  return "text";
};