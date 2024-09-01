import React, { useState } from "react";
import { useFormik } from "formik";
import { ENDPOINTS, FIELD_MAPPINGS, validations } from "./DataMappingFields";
import {
  getFormikValues,
  inputType,
} from "./DataDisplayingFunctions";

function FormNewData({ type, onAddNewData, users=[], owners=[], properties=[], tenants=[] }) {
  const [errorMessage, setErrorMessage] = useState("");

  const fields = FIELD_MAPPINGS[type];
  const validation = validations[type];
  const initialData = fields.reduce((obj, field) => {
    obj[field] = getFormikValues(field, "");
    return obj;
  }, {});

  const formik = useFormik({
    initialValues: initialData,
    validationSchema: validation,
    enableReinitialize: true,
    onSubmit: (values) => {
      fetch(`/${type}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      }).then((r) => {
        if (r.ok) {
          r.json().then((data) => {
            onAddNewData(data);
            alert("A new record has been created");
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
        New {type === "properties" ? "Property" : type.charAt(0).toUpperCase() + type.slice(1, type.length - 1)} Form
      </h1>
      <form onSubmit={formik.handleSubmit}>
        {fields.map((field) => (
          <div key={field}>
            <label>
              {field.charAt(0).toUpperCase() + field.slice(1) + ": "}
              {field === "user_id" || field === "owner_id" ? (
                <select
                  id={field}
                  name={field}
                  onChange={formik.handleChange}
                  value={formik.values[field] || ""}
                >
                  <option value="">Select {field === "user_id" ? "User" : "Owner"}</option>
                  {(field === "user_id" ? users : owners).map(option => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
              ) : field == "is_active" ? (
                <input
                  type="checkbox"
                  id={field}
                  name={field}
                  checked={formik.values[field] === true}
                  onChange={formik.handleChange}
                />
              ) : (
                <input
                  type={inputType(field)}
                  id={field}
                  name={field}
                  onChange={formik.handleChange}
                  value={formik.values[field] || ""}
                />
              )}
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

export default FormNewData;
