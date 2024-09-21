import DisplayTable from "./DisplayTable";
import { FIELD_MAPPINGS } from "./DataMappingFields";

function Users({ users, user }) {
  const fields = FIELD_MAPPINGS["users"];

  return (
    <DisplayTable
      items={users}
      fields={fields}
      defaultSortBy="id"
      type="users"
      user={user}
    />
  );
}

export default Users;
