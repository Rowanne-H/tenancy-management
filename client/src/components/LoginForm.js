import React, { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";

function LoginForm({ onLogin }) {
  const [errorMessage, setErrorMessage] = useState("");

  const formSchema = yup.object().shape({
    email: yup.string().email("Invalid email").required("Must enter email"),
    password: yup.string().required("must enter a password"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })
        .then((r) => {
          if (r.ok) {
            return r.json();
          } else {
            r.json().then((err) => setErrorMessage(err.message));
          }
        })
        .then((user) => {
          onLogin(user);
        });
      formik.resetForm();
    },
  });

  return (
    <div className="form-container">
      <h2>Sign In</h2>
      <form onSubmit={formik.handleSubmit}>
        <label>
          Email
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

        <button type="submit">Submit</button>
        <p className="errorsMessages">{errorMessage}</p>
      </form>
    </div>
  );
}

export default LoginForm;
