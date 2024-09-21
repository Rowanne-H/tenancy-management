import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import DisplayTable from "./DisplayTable";
import { ENDPOINTS, FIELD_MAPPINGS } from "./DataMappingFields";

function Transactions({ transactions = [], view = "", user }) {
  const [item, setItem] = useState({});
  const [items, setItems] = useState(transactions);
  const [fields, setFields] = useState(FIELD_MAPPINGS["transactions"]);
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
          setItems(data.transactions);
          setFields(fields.slice(2));
        });
    }
  }, [id, view]);

  return (
    <DisplayTable
      items={items}
      fields={fields}
      defaultSortBy="created_at"
      type="transactions"
      view={view}
      user={user}
      item={item}
    />
  );
}

export default Transactions;
