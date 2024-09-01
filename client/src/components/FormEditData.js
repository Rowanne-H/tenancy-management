import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useFormik } from "formik";
import { ENDPOINTS, FIELD_MAPPINGS, validations } from "./DataMappingFields";
import { generateFormikValues, inputType } from "./DataDisplayingFunctions";

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

  const fields = FIELD_MAPPINGS[type];
  const validation = validations[type];
  const initialValues = generateFormikValues(dataToEdit);

  const formik = useFormik({
    initialValues: { ...initialValues },
    validationSchema: validation,
    enableReinitialize: true,
    onSubmit: (values) => {
      console.log("Submitting form with values:", values);
      fetch(ENDPOINTS[type] + id, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      }).then((r) => {
        if (r.ok) {
          r.json().then((data) => {
            console.log("working");
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
          <div key={field}>
            <label>
              {field.charAt(0).toUpperCase() + field.slice(1) + ": "}
              {inputType(field) == "checkbox" ? (
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

        <button type="submit" onClick={() => console.log("look")}>
          Submit
        </button>
        <p className="errorsMessages">{errorMessage}</p>
      </form>
    </div>
  );
}

export default EditDataForm;
