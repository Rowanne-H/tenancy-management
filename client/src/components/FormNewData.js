import React, { useState } from "react";
import { useFormik } from "formik";
import { FIELD_MAPPINGS, validations } from "./DataMappingFields";
import {
  getFormikValues,
  inputType,
  formatTitleValue,
} from "./DataDisplayingFunctions";

function FormNewData({
  type,
  onAddNewData,
  users = [],
  owners = [],
  properties = [],
  tenants = [],
  creditors = [],
}) {
  const [errorMessage, setErrorMessage] = useState("");
  const [payFrom, setPayFrom] = useState([]);
  const [payTo, setPayTo] = useState([]);
  const [category, setCategory] = useState("");

  const fields = FIELD_MAPPINGS[type];
  const validation = validations[type];
  const initialData = fields.reduce((obj, field) => {
    obj[field] = getFormikValues(field, "");
    return obj;
  }, {});

  //setUp payfrom and payto select options when a category is selected
  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
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
    formik.setFieldValue("category", selectedCategory); // Update Formik field value
  };

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
    <div className="form-container">
      <h1>
        New{" "}
        {type === "properties"
          ? "Property"
          : type.charAt(0).toUpperCase() + type.slice(1, type.length - 1)}{" "}
        Form
      </h1>
      <form onSubmit={formik.handleSubmit}>
        {fields.map(
          (
            field, //mapping fields
          ) => (
            <div key={field}>
              <label>
                {field === "user_id" ||
                (field === "pay_to" && category === "Rent") ||
                (type == "tenants" && field === "owner_id")
                  ? null
                  : formatTitleValue(field) + ": "}
                {field === "user_id" ||
                (type == "tenants" && field === "owner_id") ? null : field ===
                    "owner_id" ||
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
                    value={formik.values[field]}
                    onChange={handleCategoryChange}
                  >
                    <option value="">Select Category</option>
                    <option value="Rent">Rent</option>
                    <option value="Expense">Expense</option>
                    <option value="Others">Others</option>
                  </select>
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
                ) : field === "created_at" ? (
                  <span>{formik.values[field]}</span>
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
          ),
        )}

        <button type="submit">Submit</button>
        <p className="errorsMessages">{errorMessage}</p>
      </form>
    </div>
  );
}

export default FormNewData;
