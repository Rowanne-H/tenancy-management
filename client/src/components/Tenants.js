import React from "react";
import DisplayTable from "./DisplayTable";
import { FIELD_MAPPINGS } from "./DataMappingFields";

function Tenants({ tenants, deleteTenant }) {
  console.log(tenants)
  const fields = FIELD_MAPPINGS["tenants"];

  return (
    <DisplayTable
      items={tenants}
      deleteItem={deleteTenant}
      fields={fields}
      defaultSortBy="id"
      type="tenants"
    />
  );
}

export default Tenants;
