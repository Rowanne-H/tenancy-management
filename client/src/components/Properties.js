import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import DisplayTable from "./DisplayTable";
import { FIELD_MAPPINGS, ENDPOINTS } from "./DataMappingFields";

function Properties({ properties = [], user, view = "" }) {
  const fields = FIELD_MAPPINGS["properties"];
  const [item, setItem] = useState();
  const [items, setItems] = useState(properties);

  const { id } = useParams();
  console.log("start")
  console.log(properties);
  console.log(view);
  console.log(id);
  useEffect(() => {
    if (id && view) {
      console.log("fecth");
      console.log(ENDPOINTS[view + "s"] + id);

      fetch(ENDPOINTS[view + "s"] + id)
        .then((r) => {
          if (!r.ok) {
            throw new Error("Network response was not ok");
          }
          return r.json();
        })
        .then((data) => {
          console.log(data);
          setItem(data);
          setItems(data.properties);
        });
    }
  }, [id, view]);
  console.log(items)

  return (
    <DisplayTable
      items={items}
      fields={fields}
      defaultSortBy="id"
      type="properties"
      user={user}
      view={view}
      item={item}
    />
  );
}

export default Properties;
