import React from "react";
import DisplayTable from "./DisplayTable";
import { FIELD_MAPPINGS } from "./DataMappingFields";

function Owners({ owners, deleteOwner, user }) {
  const fields = FIELD_MAPPINGS["owners"];

  return (
    <DisplayTable
      items={owners}
      deleteItem={deleteOwner}
      fields={fields}
      defaultSortBy="id"
      type="owners"
      user={user}
    />
  );
}

export default Owners;
