import React, { useState } from "react";
import DisplayTable from "./DisplayTable";
import { FIELD_MAPPINGS } from "./DataMappingFields";

function Users({ users, deleteUser, user }) {
  const fields = FIELD_MAPPINGS["users"];

  return (
    <DisplayTable
      items={users}
      deleteItem={deleteUser}
      fields={fields}
      defaultSortBy="id"
      type="users"
      user={user}
    />
  );
}

export default Users;
