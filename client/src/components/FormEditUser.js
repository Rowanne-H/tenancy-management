import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";

function UserForm({ onUpdateUser, changeStatus = "" }) {
  const [userToEdit, setUserToEdit] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [editPassword, setEditPassword] = useState(false);

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
    password: yup
      .string()
      .nullable()
      .test(
        "is-required",
        "Must enter a password if the user is changing password",
        function (value) {
          const { editPassword } = this.parent; // Access other fields in the current form
          if (editPassword && !value) {
            return false;
          }
          if (!editPassword && !value) {
            return true;
          }
          return value; // Return true if not editing password
        },
      ),
    confirmPassword: yup
      .string()
      .nullable()
      .test("passwords-match", "Passwords must match", function (value) {
        const { password, editPassword } = this.parent; // Access other fields in the current form
        console.log(editPassword);
        console.log("Confirm Password:", value, "Password:", password);
        if (editPassword) {
          console.log("is checking");
          if (!value) {
            return false;
          }
          if (value !== password) {
            return false;
          }
        }
        if (!editPassword && !value) {
          return true;
        }
        return value; // Check match only if editing password
      }),
    name: yup
      .string()
      .required("Must enter a name")
      .min(3, "Name must be at least 3 characters long")
      .matches(/.*\s+.*/, "Name must contain at least one space between words"),
    mobile: yup
      .string(10)
      .matches(
        /^04\d{8}$/,
        'Mobile number must start with "04" and be exactly 10 digits',
      )
      .required("Must enter a mobile"),
    is_accounts: yup.boolean(),
    is_active: yup.boolean(),
  });

  const formik = useFormik({
    initialValues: {
      email: userToEdit?.email || "",
      password: "",
      confirmPassword: "",
      name: userToEdit?.name || "",
      mobile: userToEdit?.mobile || "",
      is_accounts: userToEdit?.is_accounts || false,
      is_active: userToEdit?.is_active,
      editPassword: false,
    },
    validationSchema: formSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      let updatedValues = {};
      if (editPassword) {
        updatedValues.password = values.password;
      } else if (changeStatus) {
        updatedValues.is_accounts = values.is_accounts;
        updatedValues.is_active = values.is_active;
      } else {
        updatedValues.email = values.email;
        updatedValues.name = values.name;
        updatedValues.mobile = values.mobile;
      }
      fetch(`/users/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedValues),
      }).then((r) => {
        if (r.ok) {
          r.json().then((user) => {
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

  if (!userToEdit) {
    return <p3>Loading...</p3>;
  }

  return (
    <div className="form-container">
      <h1>
        {changeStatus
          ? "Change Status"
          : editPassword
            ? "Change Password"
            : "Edit User Form"}
      </h1>
      {changeStatus ? (
        <p>User Name: {userToEdit.name}</p>
      ) : (
        <button
          className="link-button"
          onClick={() => {
            setEditPassword(!editPassword);
            formik.setFieldValue("editPassword", !editPassword);
          }}
        >
          {editPassword ? "Edit User" : "Change Password"}
        </button>
      )}
      <form onSubmit={formik.handleSubmit}>
        {changeStatus ? (
          <div>
            <label>
              Is Accounts?
              <input
                type="checkbox"
                name="is_accounts"
                checked={formik.values.is_accounts}
                onChange={formik.handleChange}
              />
            </label>
            <label>
              Is Active?
              <input
                type="checkbox"
                name="is_active"
                checked={formik.values.is_active}
                onChange={formik.handleChange}
              />
            </label>
          </div>
        ) : editPassword ? (
          <div>
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
          </div>
        ) : (
          <div>
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
          </div>
        )}

        <button type="submit">Submit</button>
        <p className="errorsMessages">{errorMessage}</p>
      </form>
    </div>
  );
}

export default UserForm;
