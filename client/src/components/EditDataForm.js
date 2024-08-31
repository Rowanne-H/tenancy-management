import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";

const ENDPOINTS = {
  users: "/users/",
  owners: "/owners/",
  properties: "/properties/",
  tenants: "/tenants/",
  rentals: "/rentals/",
  expenses: "/expenses/",
};

const FIELD_MAPPINGS = {
  users: {
    fields: ["id", "name", "email", "mobile", "is_accounts"],
    validation: yup.object().shape({
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
  },
  owners: {
    fields: [
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
    validation: yup.object().shape({
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
      anagement_start_date: yup.string().required("Must enter a date"),
      is_active: yup.boolean(),
    }),
  },
  properties: {
    fields: [
      "id",
      "ref",
      "address",
      "commission",
      "letting_fee",
      "user_id",
      "owner_id",
      "is_active",
    ],
  },
  tenants: {
    fields: [
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
  },
  rentals: {
    fields: [
      "id",
      "amount",
      "created_at",
      "payment_date",
      "description",
      "tenant_id",
    ],
  },
  expenses: {
    fields: [
      "id",
      "amount",
      "created_at",
      "payment_date",
      "description",
      "tenant_id",
    ],
  },
};

function EditDataForm({ onUpdateData, type }) {
  const [dataToEdit, setDataToEdit] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const { id } = useParams();
  const history = useHistory();
  console.log(ENDPOINTS[type] + id);
  useEffect(() => {
    if (id && type && ENDPOINTS[type]) {
      fetch(ENDPOINTS[type] + id)
        .then((r) => {
          if (!r.ok) {
            console.log("backend");
            throw new Error("Network response was not ok");
          }
          return r.json();
        })
        .then((data) => setDataToEdit(data));
    }
  }, [id]);

  const { fields, validation } = FIELD_MAPPINGS[type] || {
    fields: [],
    validation: yup.object(),
  };

  const generateInitialValue = (field, value) => {
    if (field === "is_accounts" && !value) {
      return false;
    }
    if (field === "is_active" && !value) {
      return true;
    }
    return value;
  };
  const formatValue = (field, value) => {
    if (field === "is_accounts" || field === "is_active") {
      return value ? "Yes" : "No";
    }
    return value;
  };
  const getDate = (field, value) => {
    if (
      value != null &&
      (field === "created_at" ||
        field === "payment_date" ||
        field === "management_end_date" ||
        field === "management_start_date" ||
        field === "lease_start_date" ||
        field === "lease_end_date")
    ) {
      const date = new Date(value).toISOString().split("T")[0];
      return date;
    }
  };
  const inputType = (field) => {
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

  const formik = useFormik({
    initialValues: {
      ...Object.fromEntries(
        fields.map((field) => [
          field,
          generateInitialValue(field, dataToEdit[field]),
        ]),
      ),
    },
    validationSchema: validation,
    enableReinitialize: true,
    onSubmit: (values) => {
      console.log(values);

      const formattedValues = { ...values };
      fields.forEach((field) => {
        if (
          values[field] != null &&
          (field === "created_at" ||
            field === "payment_date" ||
            field === "management_end_date" ||
            field === "management_start_date" ||
            field === "lease_start_date" ||
            field === "lease_end_date")
        ) {
          formattedValues[field] = new Date(values[field])
            .toISOString()
            .split("T")[0];
        }
      });
      fetch(ENDPOINTS[type] + id, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedValues),
      }).then((r) => {
        if (r.ok) {
          r.json().then((data) => {
            onUpdateData(data);
            history.push(ENDPOINTS[type] + id);
          });
        } else {
          r.json().then((err) => setErrorMessage(err.message));
        }
      });
      formik.resetForm();
    },
  });

  return (
    <div>
      <h1>
        Edit {type.charAt(0).toUpperCase() + type.slice(1, type.length - 1)}{" "}
        Form
      </h1>
      <form onSubmit={formik.handleSubmit}>
        {fields.map((field) => (
          <div>
            <label>
              {field.charAt(0).toUpperCase() + field.slice(1) + ": "}
              {getDate(field, dataToEdit[field])}
              <input
                type={inputType(field)}
                id={field}
                name={field}
                onChange={formik.handleChange}
                value={formik.values[field]}
              />
            </label>
            {formik.errors[field] ? (
              <p className="errorsMessages">{formik.errors[field]}</p>
            ) : null}
          </div>
        ))}

        <button type="submit">Submit</button>
        <p className="errorsMessages">{errorMessage}</p>
      </form>
    </div>
  );
}

export default EditDataForm;
