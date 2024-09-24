import React from "react";
import DisplayTable from "./DisplayTable";
import { FIELD_MAPPINGS } from "./DataMappingFields";

function Creditors({ creditors, deleteCreditor, user }) {
  const fields = FIELD_MAPPINGS["creditors"];

  return (
    <DisplayTable
      items={creditors}
      fields={fields}
      defaultSortBy="id"
      type="creditors"
      user={user}
    />
  );
}

export default Creditors;
