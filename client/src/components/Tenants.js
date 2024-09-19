import React from "react";
import DisplayTable from "./DisplayTable";

function Tenants({ tenants, deleteTenant, user }) {
  const fields = [
    "ref",
    "name",
    "email",
    "property_id",
    "user_id",
    "is_active",
  ];

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
