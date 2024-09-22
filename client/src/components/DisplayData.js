import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { ENDPOINTS, FIELD_MAPPINGS } from "./DataMappingFields";
import { formatTitleValue, formatValue } from "./DataDisplayingFunctions";

const DisplayData = ({ type, user, onDeleteItem }) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

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
        .then((data) => setData(data))
        .catch((error) => setError(error));
    }
  }, [id, type]);

  function handleEditClick() {
    if (type === "users" && user.id !== id) {
      alert("User not authorized to edit this file");
    } else if (
      (type === "owners" || type === "tenants" || type === "properties") &&
      user.id !== data.user_id
    ) {
      alert("User not authorized to edit this file");
    } else if (
      (type === "transactions" || type === "creditors") &&
      !user.is_accounts
    ) {
      alert("Only accounts can perform this action");
    } else {
      history.push(`/${type}/${id}/edit`);
    }
  }

  function handleChangeUserClick() {
    if (user.is_accounts) {
      history.push(`/${type}/${id}/changeuser`);
    } else {
      alert("Only accounts can change managing property manager");
    }
  }

  function handleChangeStatusClick() {
    if (user.is_accounts) {
      history.push(`/${type}/${id}/changestatus`);
    } else {
      alert("Only accounts can change status");
    }
  }

  function handleDeleteClick() {
    fetch(ENDPOINTS[type] + id, {
      method: "DELETE",
    }).then((r) => {
      if (r.ok) {
        onDeleteItem(id);
        alert("Record has been deleted");
        history.push(`/${type}`);
        return r.json();
      } else {
        r.json().then((err) => alert(err.message));
      }
    });
  }

  if (error) return <p>Error: {error.message}</p>;
  if (!data) return <p>Loading...</p>;

  const fields = FIELD_MAPPINGS[type];
  console.log(data);

  return (
    <div>
      <div className="crud-actions">
        {type === "users" && user.is_accounts ? (
          <button className="link-button" onClick={handleChangeStatusClick}>
            Change Status
          </button>
        ) : type !== "users" ? (
          <button className="link-button" onClick={handleEditClick}>
            Edit
          </button>
        ) : null}
        <button className="link-button" onClick={handleDeleteClick}>
          Delete
        </button>
        {type === "owners" ? (
          <button className="link-button" onClick={handleChangeUserClick}>
            Change Property Manager
          </button>
        ) : null}
      </div>
      <div className="display-header">
        <h2>
          {type === "properties"
            ? "Property"
            : type.charAt(0).toUpperCase() +
              type.slice(1, type.length - 1)}{" "}
          Details
        </h2>
        {type === "owners" || type === "tenants" ? (
          <NavLink className="more" to={`/${type}/${id}/transactions`}>
            {type.charAt(0).toUpperCase() + type.slice(1, type.length - 1)}{" "}
            Statement
          </NavLink>
        ) : type === "users" ? (
          <NavLink className="more" to={`/${type}/${id}/owners`}>
            View Owners of Managed Properties
          </NavLink>
        ) : null}
      </div>
      <div className="details-container">
        {fields.map((field) => (
          <div className="details-item" key={field}>
            <p>
              <strong>{formatTitleValue(field)}:</strong>{" "}
            </p>
            {field === "property_id" ||
            field === "user_id" ||
            field === "owner_id" ? (
              <NavLink
                className="more"
                to={
                  field === "property_id"
                    ? `/properties/${data[field]}`
                    : field === "user_id"
                      ? `/users/${data[field]}`
                      : `/owners/${data[field]}`
                }
              >
                {field === "property_id"
                  ? data["property"]["address"]
                  : field === "user_id"
                    ? data["user"]["name"]
                    : data["owner"]["name"]}
              </NavLink>
            ) : (
              formatValue(field, data[field])
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DisplayData;
