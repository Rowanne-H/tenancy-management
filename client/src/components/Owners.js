import React from "react";
import { useParams } from "react-router-dom";
import DisplayTable from "./DisplayTable";
import { FIELD_MAPPINGS } from "./DataMappingFields";

function Owners({ owners, deleteOwner, user, view="" }) {
  const fields = FIELD_MAPPINGS["owners"];
  const { id } = useParams();
  let items = owners;
  if (view === "user") {
    const filteredOwners = owners.filter(owner => owner.user_id == id)
    items = filteredOwners;
  }

  return (
    <DisplayTable
      items={items}
      deleteItem={deleteOwner}
      fields={fields}
      defaultSortBy="id"
      type="owners"
      user={user}
      view={view}
    />
  );
}

export default Owners;
