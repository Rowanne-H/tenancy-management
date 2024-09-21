import React from "react";
import { useHistory } from "react-router-dom";
import { formatValue, getIdValue } from "./DataDisplayingFunctions";

function DisplayTableRow({
  item,
  fields,
  type,
  users = [],
  properties = [],
  owners = [],
}) {
  const history = useHistory();

  return (
    <tr onClick={() => history.push(`/${type}/${item.id}`)}>
      {fields.map((field) => (
        <td key={field}>
          {field === "property_id"
            ? getIdValue(properties, field, item[field])
            : field === "user_id"
              ? getIdValue(users, field, item[field])
              : field === "owner_id"
                ? getIdValue(owners, field, item[field])
                : formatValue(field, item[field])}
        </td>
      ))}
    </tr>
  );
}

export default DisplayTableRow;
