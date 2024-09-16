import React from "react";
import { useParams } from "react-router-dom";
import DisplayTable from "./DisplayTable";

function Owners({ owners, deleteOwner, user, view = "", users = [] }) {
  const fields = ["ref", "name", "email", "user_id", "is_active"];
  const { id } = useParams();
  let items = owners;
  let managingAgent = "";
  if (view === "user") {
    const filteredOwners = owners.filter((owner) => owner.user_id == id);
    items = filteredOwners;
    const user = users.filter((user) => user.id == id)[0];
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
      managingAgent={managingAgent}
    />
  );
}

export default Owners;
