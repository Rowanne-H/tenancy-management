import React from "react";
import DisplayTable from "./DisplayTable";

function Owners({ owners, deleteOwner }) {
  const fields = [
    "id",
    "ref",
    "name",
    "email",
    "mobile",
    "address",
    "management_start_date",
    "management_end_date",
    "is_active",
  ];

  return (
    <DisplayTable
      items={owners}
      deleteItem={deleteOwner}
      fields={fields}
      defaultSortBy="id"
      type="owners"
    />
  );
}

export default Owners;
