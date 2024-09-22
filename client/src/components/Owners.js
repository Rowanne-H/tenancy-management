import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import DisplayTable from "./DisplayTable";
import { ENDPOINTS } from "./DataMappingFields";

function Owners({ owners, user, view = "", users }) {
  const fields = ["ref", "name", "email", "user_id", "is_active"];
  const [item, setItem] = useState();
  const [items, setItems] = useState(owners);

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
          setItems(data.owners);
        });
    } else {
      setItems(owners);
    }
  }, [id, view]);

  return (
    <DisplayTable
      items={items}
      fields={fields}
      defaultSortBy="id"
      type="owners"
      user={user}
      view={view}
      item={item}
      users={users}
    />
  );
}

export default Owners;
