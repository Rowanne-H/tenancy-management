import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import DisplayTable from "./DisplayTable";
import { FIELD_MAPPINGS, ENDPOINTS } from "./DataMappingFields";

function Properties({ properties = [], user, view = "", owners, users }) {
  const fields = FIELD_MAPPINGS["properties"];
  const [item, setItem] = useState();
  const [items, setItems] = useState(properties);

  const { id } = useParams();
  useEffect(() => {
    if (id && view) {
      fetch(ENDPOINTS[view + "s"] + id)
        .then((r) => {
          if (!r.ok) {
            throw new Error("Network response was not ok");
          }
          return r.json();
        })
        .then((data) => {
          setItem(data);
          setItems(data.properties);
        });
    }
  }, [id, view]);

  return (
    <DisplayTable
      items={items}
      fields={fields}
      defaultSortBy="id"
      type="properties"
      user={user}
      view={view}
      item={item}
      owners={owners}
      users={users}
    />
  );
}

export default Properties;
