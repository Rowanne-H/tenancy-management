import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useFormik } from "formik";
import { ENDPOINTS, FIELD_MAPPINGS, validations } from "./DataMappingFields";
import {
  generateFormikValues,
  inputType,
  formatTitleValue,
} from "./DataDisplayingFunctions";

function EditDataForm({
  onUpdateData,
  type,
  users = [],
  owners = [],
  properties = [],
  tenants = [],
  creditors = [],
}) {
  const [dataToEdit, setDataToEdit] = useState({});
  const [payFrom, setPayFrom] = useState([]);
  const [payTo, setPayTo] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const { id } = useParams();
  const history = useHistory();

  useEffect(() => {
    if (id && type && ENDPOINTS[type]) {
      fetch(ENDPOINTS[type] + id).then((r) => {
        if (r.ok) {
          r.json().then((data) => {
            setDataToEdit(data);
            if (data.category) {
              setCategory(data.category);
              categoryChange(data.category);
            }
          });
        } else {
          r.json().then((err) => {
            setErrorMessage(err.message);
          });
        }
      });
    }
    // eslint-disable-next-line
  }, [id]);

  const fields = FIELD_MAPPINGS[type];
  const validation = validations[type];
  const initialValues = generateFormikValues(dataToEdit);
  const [category, setCategory] = useState("");

  const categoryChange = (selectedCategory) => {
    const activeTenants = tenants.filter((tenant) => tenant.is_active);
    const activeOwners = owners.filter((owner) => owner.is_active);
    const activeCreditors = creditors.filter((creditor) => creditor.is_active);
    setCategory(selectedCategory);
    if (selectedCategory === "Rent") {
      setPayFrom([...activeTenants]);
      setPayTo([...activeOwners]);
    } else if (selectedCategory === "Expense") {
      setPayFrom([...activeOwners]);
      setPayTo([...activeCreditors]);
    } else {
      setPayFrom([...activeOwners, ...activeTenants, ...activeCreditors]);
      setPayTo([...activeOwners, ...activeTenants, ...activeCreditors]);
    }
  };

  //setUp payfrom and payto select options when a category is selected
  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    categoryChange(selectedCategory);
    formik.setFieldValue("category", selectedCategory); // Update Formik field value
  };

  const formik = useFormik({
    initialValues: { ...initialValues },
    validationSchema: validation,
    enableReinitialize: true,
    onSubmit: (values) => {
      if (values.category === "Rent") {
        values.pay_to = "";
      }
      fetch(ENDPOINTS[type] + id, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
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
    <div className="form-container">
      <h1>
        Edit{" "}
        {type === "properties"
          ? "Property"
          : type.charAt(0).toUpperCase() + type.slice(1, type.length - 1)}{" "}
        Form
      </h1>
      <form onSubmit={formik.handleSubmit}>
        {fields.map((field) => (
          <div key={field}>
            <label>
              {field === "user_id" ||
              (field === "pay_to" && category === "Rent")
                ? null
                : formatTitleValue(field)}
              {field === "user_id" ? null : field === "owner_id" ||
                field === "property_id" ||
                field === "tenant_id" ? (
                <select
                  id={field}
                  name={field}
                  onChange={formik.handleChange}
                  value={formik.values[field] || ""}
                >
                  <option value="">
                    Select{" "}
                    {field === "user_id"
                      ? "User"
                      : field === "owner_id"
                        ? "Owner"
                        : field === "property_id"
                          ? "Property"
                          : "Tenant"}
                  </option>
                  {(field === "user_id"
                    ? users
                    : field === "owner_id"
                      ? owners
                      : field === "property_id"
                        ? properties
                        : tenants
                  ).map((option) => (
                    <option key={option.id} value={option.id}>
                      {!option.name ? option.address : option.name}
                    </option>
                  ))}
                </select>
              ) : field === "category" ? (
                <select
                  id={field}
                  name={field}
                  value={formik.values[field] || ""}
                  onChange={handleCategoryChange}
                >
                  <option value="">Select Category</option>
                  <option value="Rent">Rent</option>
                  <option value="Expense">Expense</option>
                  <option value="Others">Others</option>
                </select>
              ) : field === "created_at" ? (
                <span>{formik.values[field]}</span>
              ) : field === "pay_from" ? (
                <select
                  id={field}
                  name={field}
                  onChange={formik.handleChange}
                  value={formik.values[field] || ""}
                >
                  <option value="">Pay From</option>
                  {payFrom.map((option) => (
                    <option key={option.name} value={option.name}>
                      {!option.name ? "others" : option.name}
                    </option>
                  ))}
                </select>
              ) : field === "pay_to" ? (
                category === "Rent" ? null : (
                  <select
                    id={field}
                    name={field}
                    onChange={formik.handleChange}
                    value={formik.values[field] || ""}
                  >
                    <option value="">Pay To</option>
                    {payTo.map((option) => (
                      <option key={option.name} value={option.name}>
                        {!option.name ? "others" : option.name}
                      </option>
                    ))}
                  </select>
                )
              ) : field === "is_active" ? (
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

export default EditDataForm;
