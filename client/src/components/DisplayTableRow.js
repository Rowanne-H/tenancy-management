import React from "react";
import { NavLink, useHistory } from "react-router-dom";
import { formatValue } from "./DataDisplayingFunctions";

function DisplayTableRow({ item, fields, type }) {
  const history = useHistory();

  return (
    <tr
      onClick={() => history.push(`/${type}/${item.id}`)}
    >
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
    </tr>
  );
}

export default DisplayTableRow;
