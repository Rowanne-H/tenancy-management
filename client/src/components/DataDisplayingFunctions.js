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
};

export const getDate = (value) => {
  if (!value) {
    return "";
  }
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
    return getDate(value);
  }
  return value;
};

export const getFormikValues = (field, value) => {
  if (field === "is_active") {
    if (value !== false && value !== true) {
      value = true;
    }
    return value;
  }
  if (field === "is_accounts") {
    if (value !== false && value !== true) {
      value = false;
    }
    return value;
  }
  if (!value) {
    value = "";
    if (field === "commission") {
      value = 0.05;
    }
    if (field === "letting_fee") {
      value = 1;
    }
    if (field === "created_at") {
      value = new Date();
    }
  }
  if (isDate(field)) {
    return getDate(value);
  }
  return value;
};

export const generateFormikValues = (data) => {
  const entries = Object.entries(data).map(([field, value]) => {
    return [field, getFormikValues(field, value)];
  });
  return Object.fromEntries(entries);
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
  if (field === "is_active") {
    return "checkbox";
  }
  return "text";
};