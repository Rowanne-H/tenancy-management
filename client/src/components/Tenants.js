import React from "react";
import DisplayTable from "./DisplayTable";
import { FIELD_MAPPINGS } from "./DataMappingFields";

function Tenants({ tenants, deleteTenant, user }) {
  const fields = FIELD_MAPPINGS["tenants"];

  return (
    <DisplayTable
      items={tenants}
      deleteItem={deleteTenant}
      fields={fields}
      defaultSortBy="id"
      type="tenants"
      user={user}
    />
  );
}

export default Tenants;
