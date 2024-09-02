import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import Home from "./Home";
import NavBar from "./NavBar";
import Users from "./Users";
import Login from "./Login";
import FormEditUser from "./FormEditUser";
import Owners from "./Owners";
import Properties from "./Properties";
import DisplayData from "./DisplayData";
import FormEditData from "./FormEditData";
import FormNewData from "./FormNewData";

function App() {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [owners, setOwners] = useState([]);
  const [properties, setProperties] = useState([]);
  const [tenants, setTenants] = useState([]);

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
        });
      }
    });
  }, [user]);
  console.log(properties);

  function updateUser(updatedUser) {
    setUsers(
      users.map((user) => (user.id === updatedUser.id ? updatedUser : user)),
    );
  }
  function deleteUser(id) {
    setUsers(users.filter((user) => user.id !== id));
  }
  function updateOwner(updatedOwner) {
    setOwners(
      owners.map((owner) =>
        owner.id === updatedOwner.id ? updatedOwner : owner,
      ),
    );
  }
  function addNewOwner(newOwner) {
    setOwners([...owners, newOwner]);
  }
  function deleteOwner(id) {
    setOwners(owners.filter((owner) => owner.id !== id));
  }
  function deleteProperty(id) {
    setOwners(owners.filter((owner) => owner.id !== id));
  }
  function addNewProperty(newProperty) {
    console.log('add new property')
    setProperties([...properties, newProperty]);
  }
  function updateProperty(updatedProperty) {
    setProperties(
      owners.map((property) =>
        property.id === updatedProperty.id ? updatedProperty : property,
      ),
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
              render={() => <Users users={users} deleteUser={deleteUser} />}
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
              path="/owners"
              render={() => (
                <Owners owners={owners} deleteOwner={deleteOwner} />
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
              path="/properties"
              render={() => <Properties properties={properties} deleteProperty={deleteProperty} />}
            />
            <Route
              exact
              path="/properties/new"
              render={() => (
                <FormNewData type="properties" users={users} owners={owners} onAddNewData={addNewProperty} />
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
                <FormEditData type="properties" users={users} owners={owners} onUpdateData={updateProperty} />
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
