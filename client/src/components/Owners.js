import React from "react";
import DisplayTable from "./DisplayTable";
import { FIELD_MAPPINGS } from "./MappingData";

function Owners({ owners, deleteOwner }) {
  const fields = FIELD_MAPPINGS["owners"]

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
