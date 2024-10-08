export const isDate = (field) => {
  if (
    field === "created_at" ||
    field === "payment_date" ||
    field === "management_end_date" ||
    field === "management_start_date" ||
    field === "lease_start_date" ||
    field === "lease_end_date" ||
    field === "vacating_date"
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

export const formatTitleValue = (field) => {
  if (field === "properties") {
    return "Property";
  }
  if (field === "letting_fee") {
    return "Letting Fee(week/s)";
  }
  if (field === "commission") {
    return "Commission (%)";
  }
  if (field === "lease_term") {
    return "Lease Term (months)";
  }
  if (field === "user_id") {
    return "Property Manager";
  }
  if (field.includes("_id")) {
    return field.charAt(0).toUpperCase() + field.slice(1, field.length - 3);
  }
  if (field.includes("_")) {
    let words = field.split("_");
    let title = "";
    for (let i = 0; i < words.length; i++) {
      let word = words[i];
      title += word.charAt(0).toUpperCase() + word.slice(1) + " ";
    }
    return title.slice(0, title.length - 1);
  }
  return field.charAt(0).toUpperCase() + field.slice(1);
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
  if (field === "rent" || field === "amount") {
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    });
    return formatter.format(value);
  }
  if (field === "letting_fee") {
    return value + " week/s";
  }
  if (field === "commission") {
    return value * 100 + "%";
  }
  if (field === "lease_term") {
    return value + " months";
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
    if (field === "created_at" || field === "payment_date") {
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
  if (isDate(field)) {
    return "date";
  }
  return "text";
};

export const getIdValue = (items, field, id) => {
  const itemById = items.filter((item) => item.id == id);
  if (!itemById[0]) {
    return "";
  }
  if (field === "property_id") {
    return itemById[0].address;
  } else {
    return itemById[0].name;
  }
};
