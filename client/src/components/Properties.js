import React from "react";
import DisplayTable from "./DisplayTable";
import { FIELD_MAPPINGS } from "./DataMappingFields";

function Properties({ properties, deleteProperty, user }) {
  const fields = FIELD_MAPPINGS["properties"];

  return (
    <DisplayTable
      items={properties}
      deleteItem={deleteProperty}
      fields={fields}
      defaultSortBy="id"
      type="properties"
      user={user}
    />
  );
}

export default Properties;
