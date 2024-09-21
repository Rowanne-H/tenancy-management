import React, { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";

function SignupForm({ onLogin }) {
  const [errorMessage, setErrorMessage] = useState("");

  const formSchema = yup.object().shape({
    email: yup.string().email("Invalid email").required("Must enter email"),
    password: yup.string().required("must enter a password"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), null], "Passwords must match")
      .required("Must confirm password"),
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
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
      mobile: "",
      is_accounts: false,
      is_active: true,
    },
    validationSchema: formSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      fetch("/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
          name: values.name,
          mobile: values.mobile,
          is_accounts: values.is_accounts,
          is_active: values.is_active,
        }),
      }).then((r) => {
        if (r.ok) {
          r.json().then((user) => {
            onLogin(user);
          });
        } else {
          r.json().then((err) => setErrorMessage(err.message));
        }
      });
      formik.resetForm();
    },
  });

  return (
    <div className="form-container">
      <h2>Sign Up</h2>
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
          Confirm Password
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            onChange={formik.handleChange}
            value={formik.values.confirmPassword}
          />
        </label>
        <p className="errorsMessages"> {formik.errors.confirmPassword}</p>

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

        <button type="submit">Submit</button>
        <p className="errorsMessages">{errorMessage}</p>
      </form>
    </div>
  );
}

export default SignupForm;
