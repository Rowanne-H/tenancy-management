import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import Home from "./Home";
import NavBar from "./NavBar";
import Users from "./Users";
import Login from "./Login";
import FormEditUser from "./FormEditUser";
import DisplayData from "./DisplayData";
import FormEditData from "./FormEditData";
import FormNewData from "./FormNewData";
import Owners from "./Owners";
import Properties from "./Properties";
import Tenants from "./Tenants";
import Creditors from "./Creditors";
import Transactions from "./Transactions";

function App() {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [owners, setOwners] = useState([]);
  const [properties, setProperties] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [creditors, setCreditors] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    // auto-login
    fetch("/check_session").then((r) => {
      if (r.ok) {
        r.json().then((user) => {
          fetch("/users")
            .then((r) => r.json())
            .then((users) => {
              setUsers(users);
            });
          fetch("/owners")
            .then((r) => r.json())
            .then((owners) => {
              setOwners(owners);
            });
          fetch("/properties")
            .then((r) => r.json())
            .then((properties) => {
              setProperties(properties);
            });
          fetch("/tenants")
            .then((r) => r.json())
            .then((tenants) => {
              setTenants(tenants);
            });
          fetch("/creditors")
            .then((r) => r.json())
            .then((creditors) => {
              setCreditors(creditors);
            });
          fetch("/transactions")
            .then((r) => r.json())
            .then((transactions) => {
              setTransactions(transactions);
            });
        });
      }
    });
  }, [user]);

  function updateUser(updatedUser) {
    setUsers(
      users.map((user) => (user.id === updatedUser.id ? updatedUser : user)),
    );
  }
  function deleteUser(id) {
    setUsers(users.filter((user) => user.id !== id));
  }

  function addNewOwner(newOwner) {
    setOwners([...owners, newOwner]);
  }
  function updateOwner(updatedOwner) {
    setOwners(
      owners.map((owner) =>
        owner.id === updatedOwner.id ? updatedOwner : owner,
      ),
    );
  }
  function deleteOwner(id) {
    setOwners(owners.filter((owner) => owner.id !== id));
  }

  function addNewProperty(newProperty) {
    console.log("add new property");
    setProperties([...properties, newProperty]);
  }
  function updateProperty(updatedProperty) {
    setProperties(
      properties.map((property) =>
        property.id === updatedProperty.id ? updatedProperty : property,
      ),
    );
  }
  function deleteProperty(id) {
    setProperties(properties.filter((property) => property.id !== id));
  }

  function addNewTenant(newTenant) {
    setTenants([...tenants, newTenant]);
  }
  function updateTenant(updatedTenant) {
    setTenants(
      tenants.map((tenant) =>
        tenant.id === updatedTenant.id ? updatedTenant : tenant,
      ),
    );
  }
  function deleteTenant(id) {
    setTenants(tenants.filter((tenant) => tenant.id !== id));
  }

  function addNewCreditor(newCreditor) {
    setCreditors([...creditors, newCreditor]);
  }
  function updateCreditor(updatedCreditor) {
    setCreditors(
      creditors.map((creditor) =>
        creditor.id === updatedCreditor.id ? updatedCreditor : creditor,
      ),
    );
  }
  function deleteCreditor(id) {
    setCreditors(creditors.filter((creditor) => creditor.id !== id));
  }

  function addNewTransaction(newTransaction) {
    setTransactions([...transactions, newTransaction]);
  }
  function updateTransaction(updatedTransaction) {
    setTransactions(
      transactions.map((transaction) =>
        transaction.id === updatedTransaction.id
          ? updatedTransaction
          : transaction,
      ),
    );
  }
  function deleteTransaction(id) {
    setTransactions(
      transactions.filter((transaction) => transaction.id !== id),
    );
  }

  return (
    <Router>
      {user ? (
        <div className="App">
          <NavBar user={user} setUser={setUser} />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route
              exact
              path="/users"
              render={() => (
                <Users users={users} user={user} deleteUser={deleteUser} />
              )}
            />
            <Route
              exact
              path="/users/:id"
              render={() => <DisplayData type="users" />}
            />
            <Route
              exact
              path="/users/:id/edit"
              render={() => <FormEditUser onUpdateUser={updateUser} />}
            />
            <Route
              exact
              path="/users/:id/changestatus"
              render={() => (
                <FormEditUser onUpdateUser={updateUser} changeStatus="true" />
              )}
            />
            <Route
              exact
              path="/users/:id/owners"
              render={() => (
                <Owners owners={owners} deleteOwner={deleteOwner} view="user" />
              )}
            />
            <Route
              exact
              path="/owners"
              render={() => (
                <Owners owners={owners} deleteOwner={deleteOwner} user={user} />
              )}
            />
            <Route
              exact
              path="/owners/new"
              render={() => (
                <FormNewData type="owners" onAddNewData={addNewOwner} />
              )}
            />
            <Route
              exact
              path="/owners/:id"
              render={() => <DisplayData type="owners" />}
            />
            <Route
              exact
              path="/owners/:id/edit"
              render={() => (
                <FormEditData type="owners" onUpdateData={updateOwner} />
              )}
            />
            <Route
              exact
              path="/owners/:id/transactions"
              render={() => (
                <Transactions
                  transactions={transactions}
                  deleteTransaction={deleteTransaction}
                  view="owner"
                  properties={properties}
                />
              )}
            />
            <Route
              exact
              path="/properties"
              render={() => (
                <Properties
                  properties={properties}
                  deleteProperty={deleteProperty}
                  user={user}
                />
              )}
            />
            <Route
              exact
              path="/properties/new"
              render={() => (
                <FormNewData
                  type="properties"
                  users={users}
                  owners={owners}
                  onAddNewData={addNewProperty}
                />
              )}
            />
            <Route
              exact
              path="/properties/:id"
              render={() => <DisplayData type="properties" />}
            />
            <Route
              exact
              path="/properties/:id/edit"
              render={() => (
                <FormEditData
                  type="properties"
                  users={users}
                  owners={owners}
                  onUpdateData={updateProperty}
                />
              )}
            />
            <Route
              exact
              path="/tenants"
              render={() => (
                <Tenants
                  tenants={tenants}
                  deleteTenant={deleteTenant}
                  user={user}
                />
              )}
            />
            <Route
              exact
              path="/tenants/new"
              render={() => (
                <FormNewData
                  type="tenants"
                  properties={properties}
                  onAddNewData={addNewTenant}
                />
              )}
            />
            <Route
              exact
              path="/tenants/:id"
              render={() => <DisplayData type="tenants" />}
            />
            <Route
              exact
              path="/tenants/:id/edit"
              render={() => (
                <FormEditData
                  type="tenants"
                  properties={properties}
                  onUpdateData={updateTenant}
                />
              )}
            />
            <Route
              exact
              path="/tenants/:id/transactions"
              render={() => (
                <Transactions
                  transactions={transactions}
                  deleteTransaction={deleteTransaction}
                  view="tenant"
                  properties={properties}
                />
              )}
            />
            <Route
              exact
              path="/creditors"
              render={() => (
                <Creditors
                  creditors={creditors}
                  deleteCreditor={deleteCreditor}
                  user={user}
                />
              )}
            />
            <Route
              exact
              path="/creditors/new"
              render={() => (
                <FormNewData type="creditors" onAddNewData={addNewCreditor} />
              )}
            />
            <Route
              exact
              path="/creditors/:id"
              render={() => <DisplayData type="creditors" />}
            />
            <Route
              exact
              path="/creditors/:id/edit"
              render={() => (
                <FormEditData type="creditors" onUpdateData={updateCreditor} />
              )}
            />
            <Route
              exact
              path="/transactions"
              render={() => (
                <Transactions
                  transactions={transactions}
                  deleteTransaction={deleteTransaction}
                  user={user}
                />
              )}
            />
            <Route
              exact
              path="/transactions/new"
              render={() => (
                <FormNewData
                  type="transactions"
                  tenants={tenants}
                  properties={properties}
                  owners={owners}
                  creditors={creditors}
                  onAddNewData={addNewTransaction}
                />
              )}
            />
            <Route
              exact
              path="/transactions/:id"
              render={() => <DisplayData type="transactions" />}
            />
            <Route
              exact
              path="/transactions/:id/edit"
              render={() => (
                <FormEditData
                  type="transactions"
                  tenants={tenants}
                  properties={properties}
                  owers={owners}
                  creditors={creditors}
                  onUpdateData={updateTransaction}
                />
              )}
            />
          </Switch>
        </div>
      ) : (
        <Login onLogin={setUser} />
      )}
    </Router>
  );
}

export default App;
