import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";

function FormChangeUser({
  users,
  properties,
  tenants,
  onUpdateOwner,
  onUpdateProperty,
  onUpdateTenant,
}) {
  const [errorMessage, setErrorMessage] = useState("");
  const [ownerToEdit, setOwnerToEdit] = useState({});

  const { id } = useParams();
  const history = useHistory();

  useEffect(() => {
    if (id) {
      fetch(`/owners/${id}`)
        .then((r) => r.json())
        .then((owner) => {
          setOwnerToEdit(owner);
          formik.setValues({ user_id: owner.user_id });
        });
    }
  }, [id]);

  const formSchema = yup.object().shape({
    user_id: yup.string().required("must select a user"),
  });

  const formik = useFormik({
    initialValues: {
      user_id: ownerToEdit.user_id,
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      const filteredProperties = properties.filter(
        (property) => property.owner_id == ownerToEdit.id,
      );
      filteredProperties.forEach((property) => {
        fetch(`/properties/${property.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_id: values.user_id }),
        }).then((r) => {
          if (r.ok) {
            r.json().then((property) => {
              onUpdateProperty(property);
            });
          } else {
            r.json().then((err) => setErrorMessage(err.message));
          }
        });
      });
      const filteredTenants = tenants.filter(
        (tenant) => tenant.owner_id == ownerToEdit.id,
      );
      filteredTenants.forEach((tenant) => {
        fetch(`/tenants/${tenant.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_id: values.user_id }),
        }).then((r) => {
          if (r.ok) {
            r.json().then((tenant) => {
              onUpdateTenant(tenant);
            });
          } else {
            r.json().then((err) => setErrorMessage(err.message));
          }
        });
      });
      fetch(`/owners/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      }).then((r) => {
        if (r.ok) {
          r.json().then((owner) => {
            onUpdateOwner(owner);
            history.push(`/owners/${id}`);
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
      <form onSubmit={formik.handleSubmit}>
        <select
          id="user_id"
          name="user_id"
          onChange={formik.handleChange}
          value={formik.values.user_id}
        >
          <option value="">Select Property Manager</option>
          {users.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>
        <button type="submit">Submit</button>
        <p className="errorsMessages">{errorMessage}</p>
      </form>
    </div>
  );
}

export default FormChangeUser;
