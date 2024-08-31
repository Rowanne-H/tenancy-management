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

export const getDate = (value) => {
  if (!value) {return ""}
  const date = new Date(value).toISOString().split("T")[0];
  return date;
};

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

export const generateFormikValues = (dataToEdit) => {
  const entries = Object.entries(dataToEdit).map(([field, value]) => {
    if (field === "is_active" || field === "is_accounts") {
      return [field, value]
    }
    if (!value) {return [field, ""]}
    if (isDate(field)) {return [field, getDate(value)]}
    return [field, value]
  })
  return Object.fromEntries(entries)
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