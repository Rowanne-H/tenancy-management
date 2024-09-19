import React from "react";
import { NavLink, useHistory } from "react-router-dom";
import { ENDPOINTS } from "./DataMappingFields";
import { formatValue } from "./DataDisplayingFunctions";

function DisplayTableRow({
  item,
  onDeleteItem,
  fields,
  type,
  view = "",
  user,
}) {
  function handleDeleteClick() {
    fetch(ENDPOINTS[type] + item.id, {
      method: "DELETE",
    }).then((r) => {
      if (r.ok) {
        onDeleteItem(item.id);
        alert("Record has been deleted");
        return r.json();
      } else {
        r.json().then((err) => alert(err.message));
      }
    });
  }
  const history = useHistory();
  function handleEditClick() {
    if (type === "users" && user.id !== item.id) {
      alert("User not authorized to to edit this file");
    } else if (
      (type === "owners" || type === "tenants" || type === "properties") &&
      user.id !== item.user_id
    ) {
      alert("User not authorized to to edit this file");
    } else if (
      (type === "transactions" || type === "creditors") &&
      !user.is_accounts
    ) {
      alert("Only accounts can perform this action");
    } else {
      history.push(`/${type}/${item.id}/edit`);
    }
  }
  function handleChangeStatusClick() {
    if (user.is_accounts) {
      history.push(`/${type}/${item.id}/changestatus`);
    } else {
      alert("User not authorized to change status");
    }
  }

  function handleChangeUserClick() {
    if (user.is_accounts) {
      history.push(`/${type}/${item.id}/changeuser`);
    } else {
      alert("User not authorized to change status");
    }
  }

  return (
    <tr onClick={() => history.push(`/${type}/${item.id}`)}>
      <td>{item.id}</td>
      {fields.map((field) => (
        <td key={field}>
          {field === "property_id" ||
          field === "user_id" ||
          field === "owner_id" ? (
            <NavLink
              className="ids"
              to={
                field === "property_id"
                  ? `/properties/${item[field]}`
                  : field === "user_id"
                    ? `/users/${item[field]}`
                    : `/owners/${item[field]}`
              }
            >
              {formatValue(field, item[field])}
            </NavLink>
          ) : (
            formatValue(field, item[field])
          )}
        </td>
      ))}
      {view === "owner" || view === "tenant" || view === "user" ? null : (
        <td>
          
          <button className="link-button" onClick={handleEditClick}>
            Edit
          </button>
          <button className="link-button" onClick={handleDeleteClick}>
            Delete
          </button>

          {type === "users" ? (
            <button className="link-button" onClick={handleChangeStatusClick}>
              Change Status
            </button>
          ) : null}
          {type === "owners" ? (
            <button className="link-button" onClick={handleChangeUserClick}>
              Change User
            </button>
          ) : null}
        </td>
      )}
    </tr>
  );
}

export default DisplayTableRow;
