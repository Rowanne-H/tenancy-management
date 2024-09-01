import React from "react";
import DisplayTable from "./DisplayTable";
import { FIELD_MAPPINGS } from "./DataMappingFields";

function Properties({ properties, deleteProperty }) {
  const fields = FIELD_MAPPINGS["properties"];

  return (
    <DisplayTable
      items={properties}
      deleteItem={deleteProperty}
      fields={fields}
      defaultSortBy="id"
      type="properties"
    />
  );
}

export default Properties;
