import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { ENDPOINTS, FIELD_MAPPINGS } from "./DataMappingFields";
import { formatValue } from "./DataDisplayingFunctions";

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
      alert("User not authorized to to edit this file");
    } else if (
      (type === "owners" || type === "tenants" || type === "properties") &&
      user.id !== id
    ) {
      alert("User not authorized to to edit this file");
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
      alert("User not authorized to change status");
    }
  }

  function handleChangeStatusClick() {
    if (user.is_accounts) {
      history.push(`/${type}/${id}/changestatus`);
    } else {
      alert("User not authorized to change status");
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
      <div className="">
        {type === "users" && user.is_accounts ? (
          <button className="link-button" onClick={handleChangeStatusClick}>
            Change Status
          </button>
        ) : (
          <button className="link-button" onClick={handleEditClick}>
            Edit
          </button>
        )}
        <button className="link-button" onClick={handleDeleteClick}>
          Delete
        </button>
        {type === "owners" ? (
          <button className="link-button" onClick={handleChangeUserClick}>
            Change Property Manager
          </button>
        ) : null}
      </div>
      <h2>
        {type === "properties"
          ? "Property"
          : type.charAt(0).toUpperCase() + type.slice(1, type.length - 1)}{" "}
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
      <ul>
        <li>
          <strong>Id:</strong>
          {id}
        </li>
        {fields.map((field) => (
          <li key={field}>
            <strong>{field.charAt(0).toUpperCase() + field.slice(1)}:</strong>{" "}
            {field === "property_id" ||
            field === "user_id" ||
            field === "owner_id" ? (
              <NavLink
                className="ids"
                to={
                  field === "property_id"
                    ? `/properties/${data[field]}`
                    : field === "user_id"
                      ? `/users/${data[field]}`
                      : `/owners/${data[field]}`
                }
              >
                {formatValue(field, data[field])} <label>View details</label>
              </NavLink>
            ) : (
              formatValue(field, data[field])
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DisplayData;
