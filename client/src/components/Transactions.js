import React,  { useState } from "react";
import { useParams } from "react-router-dom";
import DisplayTable from "./DisplayTable";
import { FIELD_MAPPINGS } from "./DataMappingFields";

function Transactions({ transactions, deleteTransaction, view='', properties=[] }) {
  let items = transactions;
  const fields = FIELD_MAPPINGS["transactions"];
  const { id } = useParams();
  if (view === "owner") {
    const filteredProperties = properties.filter(property => property.owner_id == id);
    const ownerTransactions = transactions.filter(transaction => 
      filteredProperties.some(property => property.id === transaction.property_id)
    );
    items = ownerTransactions;
  }
  if (view === "tenant") {
    console.log(id)
    const tenantTransactions = transactions.filter(transaction => transaction.tenant_id == id);
    items = tenantTransactions;
  }

  return (
    <DisplayTable
      items={items}
      deleteItem={deleteTransaction}
      fields={fields}
      defaultSortBy="created_at"
      type="transactions"
      view={view}
    />
  );
}

export default Transactions;
