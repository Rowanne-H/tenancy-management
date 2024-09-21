import React from "react";
import { useHistory } from "react-router-dom";
import { formatValue } from "./DataDisplayingFunctions";

function DisplayTableRow({ item, fields, type }) {
  const history = useHistory();
  
  console.log("ownersProperties")

  console.log(item)

  return (
    <tr onClick={() => history.push(`/${type}/${item.id}`)}>
      {fields.map((field) => (
        <td key={field}>
          {field === "property_id"
            ? item["property"].address
            : field === "user_id"
              ? item["user"].name
              : field === "owner_id"
                ? item["owner"].name
                : formatValue(field, item[field])}
        </td>
      ))}
    </tr>
  );
}

export default DisplayTableRow;
