import React, { useState } from "react";
import { useParams } from "react-router-dom";
import DisplayTable from "./DisplayTable";
import { FIELD_MAPPINGS } from "./DataMappingFields";

function Transactions({
  transactions,
  deleteTransaction,
  view = "",
  properties = [],
  user,
}) {
  let items = transactions;
  let fields = FIELD_MAPPINGS["transactions"];
  const { id } = useParams();
  if (view === "owner") {
    const ownerTransactions = transactions.filter(
      (transaction) => transaction.owner_id == id,
    );
    items = ownerTransactions;
    fields = fields.slice(2);
  }
  if (view === "tenant") {
    const tenantTransactions = transactions.filter(
      (transaction) => transaction.tenant_id == id,
    );
    items = tenantTransactions;
    fields = fields.slice(2);
  }

  return (
    <DisplayTable
      items={items}
      deleteItem={deleteTransaction}
      fields={fields}
      defaultSortBy="created_at"
      type="transactions"
      view={view}
      user={user}
    />
  );
}

export default Transactions;
