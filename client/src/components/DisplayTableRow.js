import React from "react";
import { NavLink } from "react-router-dom";
import { ENDPOINTS } from "./DataMappingFields";
import { formatValue } from "./DataDisplayingFunctions";

function DisplayTableRow({ item, onDeleteItem, fields, type, view = "" }) {
  function handleDeleteClick() {
    fetch(ENDPOINTS[type] + item.id, {
      method: "DELETE",
    }).then((r) => {
      if (r.ok) {
        onDeleteItem(item.id);
        alert("Record has been deleted");
        return r.json((item) => console.log(item));
      } else {
        r.json().then((err) => alert(err.message));
      }
    });
  }

  return (
    <tr>
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
      {view === "owner" || view === "tenant" ? null : (
        <td>
          <NavLink className="more" to={`/${type}/${item.id}`}>
            View
          </NavLink>
          <NavLink className="more" to={`/${type}/${item.id}/edit`}>
            Edit
          </NavLink>
          <button className="link-button" onClick={handleDeleteClick}>
            Delete
          </button>
        </td>
      )}
    </tr>
  );
}

export default DisplayTableRow;
