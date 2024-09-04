import React from "react";
import DisplayTable from "./DisplayTable";
import { FIELD_MAPPINGS } from "./DataMappingFields";

function Transactions({ transactions, deleteTransaction }) {
  console.log(transactions);

  const fields = FIELD_MAPPINGS["transactions"];

  return (
    <DisplayTable
      items={transactions}
      deleteItem={deleteTransaction}
      fields={fields}
      defaultSortBy="created_at"
      type="transactions"
    />
  );
}

export default Transactions;
