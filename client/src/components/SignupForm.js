import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";

function SignupForm({ users }) {
    const formSchema = yup.object().shape({
        email: yup.string().email("Invalid email").required("Must enter email"),
        password: yup.string().required("must enter a password"),
        name: yup.string().required("Must enter a name").min(2, "Name must be at least 2 characters long"),
        mobile: yup.string(10).matches(/^04\d{8}$/, "Mobile number must start with '04' and be exactly 10 digits").required("Must enter a mobile"),
        is_accounts: yup.boolean()
    });

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
            name: "",
            mobile: "",
            is_accounts: false
        },
        validationSchema: formSchema,
        onSubmit: (values) => {
            fetch("/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values, null, 2),
            }).then(r => {
                if (r.ok) {
                    return r.json();
                } else {
                    throw new Error('Network response was not ok.');
                }
            }).then(user => {
                console.log(user);
            })
            formik.resetForm();
        }
    })

    return (
        <div>
            <h1>User sign up form</h1>
            <form onSubmit={formik.handleSubmit}>
                <label>Email Address
                    <input id="email" name="email" onChange={formik.handleChange} value={formik.values.email} />
                </label>
                <p className="errorsMessages"> {formik.errors.email}</p>

                <label>Password
                    <input id="password" name="password" onChange={formik.handleChange} value={formik.values.password} />
                </label>
                <p className="errorsMessages"> {formik.errors.password}</p>

                <label>Name
                    <input id="name" name="name" onChange={formik.handleChange} value={formik.values.name} />
                </label>
                <p className="errorsMessages"> {formik.errors.name}</p>

                <label>mobile
                    <input id="mobile" name="mobile" onChange={formik.handleChange} value={formik.values.mobile} />
                </label>
                <p className="errorsMessages"> {formik.errors.mobile}</p>

                <label>Is Accounts?
                    <input type="checkbox" name="is_accounts" checked={formik.values.is_accounts} onChange={formik.handleChange} />
                </label>

                <button type="submit">Submit</button>
            </form>
        </div>
    )
}

export default SignupForm;