import React, { useState } from "react";
import DisplayTable from "./DisplayTable";
import { FIELD_MAPPINGS } from "./DataMappingFields";

function Users({ users, deleteUser }) {
  const fields = FIELD_MAPPINGS["users"];
  console.log(users)

  return (
    <DisplayTable
      items={users}
      deleteItem={deleteUser}
      fields={fields}
      defaultSortBy="id"
      type="users"
    />
  );
}

export default Users;
