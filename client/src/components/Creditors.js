import React from "react";
import DisplayTable from "./DisplayTable";
import { FIELD_MAPPINGS } from "./DataMappingFields";

function Creditors({ creditors, deleteCreditor }) {
  const fields = FIELD_MAPPINGS["creditors"];

  return (
    <DisplayTable
      items={creditors}
      deleteItem={deleteCreditor}
      fields={fields}
      defaultSortBy="id"
      type="creditors"
    />
  );
}

export default Creditors;
