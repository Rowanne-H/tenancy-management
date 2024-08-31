import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import { ENDPOINTS, FIELD_MAPPINGS } from "./DataMappingFields";
import { generateFormikValues, isDate, getDate, inputType  } from "./DataDisplayingFunctions";

const validations = {
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
      anagement_start_date: yup.string().required("Must enter a date"),
      is_active: yup.boolean(),
    }),
  
};

function EditDataForm({ onUpdateData, type }) {
  const [dataToEdit, setDataToEdit] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  const { id } = useParams();
  const history = useHistory();

  useEffect(() => {
    if (id && type && ENDPOINTS[type]) {
      fetch(ENDPOINTS[type] + id)
        .then((r) => {
          if (!r.ok) {
            throw new Error("Network response was not ok");
          }
          return r.json();
        })
        .then((data) => setDataToEdit(data));
    }
  }, [id]);

  const fields = FIELD_MAPPINGS[type]
  const validation = validations[type] 
  const initialValues = generateFormikValues(dataToEdit);
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    console.log(name)
    if (type === "date") {
      // Handle date input differently
      formik.setFieldValue(value, getDate(value));
    } else {
      // Use Formik's default handleChange
      formik.handleChange(e);
    }
  };

  const formik = useFormik({
    initialValues: {...initialValues},
    validationSchema: validation,
    enableReinitialize: true,
    onSubmit: (values) => {   
      console.log("Submitting form with values:", values);   
      fetch(ENDPOINTS[type] + id, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(generateFormikValues(values)),
      }).then((r) => {
        if (r.ok) {
          r.json().then((data) => {
            console.log("working")
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
        Edit {type.charAt(0).toUpperCase() + type.slice(1, type.length - 1)} Form
      </h1>
      <form onSubmit={formik.handleSubmit}>
        {fields.map((field) => (
          <div key={field}>
            <label>
              {field.charAt(0).toUpperCase() + field.slice(1) + ": "}
              {isDate(field) ? getDate(dataToEdit[field]) : ""}
              <input
                type={inputType(field)}
                id={field}
                name={field}
                onChange={handleChange}
                value={formik.values[field] || ""}
              />
            </label>
            {formik.errors[field] ? (
              <p className="errorsMessages">{formik.errors[field]}</p>
            ) : null}
          </div>
        ))}

        <button type="submit" onClick={()=>console.log('look')}>Submit</button>
        <p className="errorsMessages">{errorMessage}</p>
      </form>
    </div>
  );
}

export default EditDataForm;
