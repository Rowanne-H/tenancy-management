import * as yup from "yup";

export const ENDPOINTS = {
  users: "/users/",
  owners: "/owners/",
  properties: "/properties/",
  tenants: "/tenants/",
  transactions: "/transactions/",
};

export const FIELD_MAPPINGS = {
  users: ["name", "email", "mobile", "is_accounts"],
  owners: [
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
    "ref",
    "address",
    "commission",
    "letting_fee",
    "user_id",
    "owner_id",
    "is_active",
  ],
  tenants: [
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
  transactions: [
    "category",
    "created_at",
    "payment_date",
    "amount",
    "description",
    "property_id",
  ],
};

export const validations = {
  users: yup.object().shape({
    email: yup.string().email("Invalid email").required("Must enter email"),
    password: yup.string().required("must enter a password"),
    name: yup
      .string()
      .required("Must enter a name")
      .min(2, "Name must be at least 2 characters long"),
    mobile: yup
      .string(10)
      .matches(
        /^04\d{8}$/,
        'Mobile number must start with "04" and be exactly 10 digits',
      )
      .required("Must enter a mobile"),
    is_accounts: yup.boolean(),
  }),
  owners: yup.object().shape({
    ref: yup
      .string()
      .required("Must enter ref")
      .min(2, "Name must be at least 2 characters long"),
    name: yup
      .string()
      .required("Must enter a name")
      .min(2, "Name must be at least 2 characters long"),
    email: yup.string().email("Invalid email").required("Must enter email"),
    mobile: yup
      .string(10)
      .matches(
        /^04\d{8}$/,
        'Mobile number must start with "04" and be exactly 10 digits',
      )
      .required("Must enter a mobile"),
    address: yup
      .string()
      .required("Must enter ref")
      .min(10, "Name must be at least 10 characters long"),
    management_start_date: yup.string().required("Must enter a date"),
    is_active: yup.boolean(),
  }),
  properties: yup.object().shape({
    ref: yup
      .string()
      .required("Must enter ref")
      .min(2, "Name must be at least 2 characters long"),
    address: yup
      .string()
      .required("Must enter ref")
      .min(10, "Name must be at least 10 characters long"),
    commission: yup
      .number()
      .required("Must enter a commission")
      .min(0, "comission must be between 0 and 0.1")
      .max(0.1, "comission must be between 0 and 0.1"),
    letting_fee: yup
      .number()
      .required("Must enter a  letting fee")
      .min(0, "letting fee must be between 0 and 2")
      .max(2, "letting fee must be between 0 and 2"),
    is_active: yup.boolean(),
  }),
  tenants: yup.object().shape({
    ref: yup
      .string()
      .required("Must enter ref")
      .min(2, "Name must be at least 2 characters long"),
    name: yup
      .string()
      .required("Must enter a name")
      .min(2, "Name must be at least 2 characters long"),
    email: yup.string().email("Invalid email").required("Must enter email"),
    mobile: yup
      .string(10)
      .matches(
        /^04\d{8}$/,
        'Mobile number must start with "04" and be exactly 10 digits',
      )
      .required("Must enter a mobile"),
    lease_term: yup
      .number()
      .required("Must enter a lease term")
      .min(0, "Lease term must be between 0 and 12")
      .max(12, "Lease term must be between 0 and 12"),
    lease_start_date: yup.string().required("Must enter a date"),
    lease_end_date: yup.string().required("Must enter a date"),
    rent: yup
      .number()
      .required("Must enter an amount")
      .min(0, "Amount must be more than 0"),
    is_active: yup.boolean(),
  }),
};
