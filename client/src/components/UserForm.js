import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";

function UserForm({ onUpdateUser }) {
  const [userToEdit, setUserToEdit] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const { id } = useParams();
  const history = useHistory();

  useEffect(() => {
    if (id) {
      fetch(`/users/${id}`)
        .then((r) => r.json())
        .then((user) => setUserToEdit(user));
    }
  }, [id]);

  const formSchema = yup.object().shape({
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
  });

  const formik = useFormik({
    initialValues: {
      email: userToEdit?.email || "",
      password: userToEdit?.password || "",
      name: userToEdit?.name || "",
      mobile: userToEdit?.mobile || "",
      is_accounts: userToEdit?.is_accounts || false,
    },
    validationSchema: formSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      fetch(`/users/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      }).then((r) => {
        if (r.ok) {
          r.json().then((user) => {
            console.log(user);
            onUpdateUser(user);
            history.push(`/users/${id}`);
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
      <h1>Edit User Form</h1>
      <form onSubmit={formik.handleSubmit}>
        <label>
          Email Address
          <input
            id="email"
            name="email"
            onChange={formik.handleChange}
            value={formik.values.email}
          />
        </label>
        <p className="errorsMessages"> {formik.errors.email}</p>

        <label>
          Password
          <input
            type="password"
            id="password"
            name="password"
            onChange={formik.handleChange}
            value={formik.values.password}
          />
        </label>
        <p className="errorsMessages"> {formik.errors.password}</p>

        <label>
          Name
          <input
            id="name"
            name="name"
            onChange={formik.handleChange}
            value={formik.values.name}
          />
        </label>
        <p className="errorsMessages"> {formik.errors.name}</p>

        <label>
          mobile
          <input
            id="mobile"
            name="mobile"
            onChange={formik.handleChange}
            value={formik.values.mobile}
          />
        </label>
        <p className="errorsMessages"> {formik.errors.mobile}</p>

        <label>
          Is Accounts?
          <input
            type="checkbox"
            name="is_accounts"
            checked={formik.values.is_accounts}
            onChange={formik.handleChange}
          />
        </label>

        <button type="submit">Submit</button>
        <p className="errorsMessages">{errorMessage}</p>
      </form>
    </div>
  );
}

export default UserForm;
