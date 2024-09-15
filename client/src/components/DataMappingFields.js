import * as yup from "yup";

export const ENDPOINTS = {
  users: "/users/",
  owners: "/owners/",
  properties: "/properties/",
  tenants: "/tenants/",
  transactions: "/transactions/",
  creditors: "/creditors/",
};

export const FIELD_MAPPINGS = {
  users: ["name", "email", "mobile", "is_accounts", "is_active"],
  owners: [
    "ref",
    "name",
    "email",
    "mobile",
    "address",
    "note",
    "management_start_date",
    "management_end_date",
    "user_id",
    "is_active",
  ],
  properties: [
    "ref",
    "address",
    "commission",
    "letting_fee",
    "owner_id",
    "user_id",
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
    "user_id",
    "is_active",
  ],
  creditors: ["name", "is_active"],
  transactions: [
    "created_at",
    "payment_date",
    "category",
    "pay_from",
    "pay_to",
    "amount",
    "description",
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
    management_end_date: yup
      .string()
      .nullable()
      .test(
        "is-after-managment-start-date",
        "End date must be after the start date",
        function (value) {
          const { management_start_date } = this.parent;
          if (!value) return true;
          return new Date(value) > new Date(management_start_date);
        },
      ),
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
    lease_end_date: yup
      .string()
      .required("Must enter a date")
      .test(
        "is-after-lease-start-date",
        "Lease end date must be after the start date",
        function (value) {
          const { lease_start_date } = this.parent;
          return new Date(value) > new Date(lease_start_date);
        },
      ),
    vacating_date: yup
      .string()
      .nullable()
      .test(
        "is-after-lease-start-date",
        "Vacating date must be after the start date",
        function (value) {
          const { lease_start_date } = this.parent;
          if (!value) return true;
          return new Date(value) > new Date(lease_start_date);
        },
      ),
    rent: yup
      .number()
      .required("Must enter an amount")
      .min(0, "Amount must be more than 0"),
    is_active: yup.boolean(),
  }),
  creditors: yup.object().shape({
    name: yup
      .string()
      .required("Must enter a name")
      .min(2, "Name must be at least 2 characters long"),
  }),
  transactions: yup.object().shape({
    created_at: yup.string().required("Must enter a date"),
    category: yup
      .string()
      .oneOf(["Rent", "Expense", "Others"], "Invalid category")
      .required("Must select a category"),
    pay_from: yup.string().required("Must select a payer"),
    pay_to: yup
      .string()
      .nullable()
      .test(
        "is-category-rent",
        "A recipient must be selected if category is not rent",
        function (value) {
          const { category } = this.parent;
          if (category == "Rent" && !value) return true;
          return value;
        },
      ),
    payment_date: yup.string().required("Must enter a date"),
    amount: yup
      .number()
      .required("Must enter an amount")
      .test(
        "amount-validation",
        "Invalid amount based on category",
        function (value) {
          const { category } = this.parent;
          if (category === "Rent" && value <= 0) return false;
          if (category === "Expense" && value >= 0) return false;
          return true;
        },
      ),
  }),
};
