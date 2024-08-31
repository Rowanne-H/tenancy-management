import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import Home from "./Home";
import NavBar from "./NavBar";
import Users from "./Users";
import Login from "./Login";
import UserForm from "./UserForm";
import Owners from "./Owners";
import DisplayData from "./DisplayData";
import EditDataForm from "./EditDataForm";

function App() {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [owners, setOwners] = useState([]);

  useEffect(() => {
    // auto-login
    fetch("/check_session").then((r) => {
      if (r.ok) {
        r.json().then((user) => {
          fetch("/users")
            .then((r) => r.json())
            .then((users) => {
              console.log("users"+users)
              setUsers(users);
            });
          fetch("/owners")
            .then((r) => r.json())
            .then((owners) => {
              
              console.log("owners"+owners)
              setOwners(owners);
            });
        });
      }
    });
  }, [user]);

  function addNewUser(newUser) {
    setUsers([...users, newUser]);
  }
  function updateUser(updatedUser) {
    setUsers(
      users.map((user) => (user.id === updatedUser ? updatedUser : user)),
    );
  }
  function deleteUser(id) {
    setUsers(users.filter((user) => user.id !== id));
  }
  function deleteOwner(id) {
    setOwners(owners.filter((owner) => owner.id !== id));
  }
  function updateOwner(updatedOwner) {
    setOwners(
      owners.map((owner) => (owner.id === updatedOwner ? updatedOwner : owner)),
    );
  }

  


  if (!user) return <Login onLogin={setUser} onAddNewUser={addNewUser} />;

  return (
    <Router>
      <div className="App">
        <NavBar user={user} setUser={setUser} />
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/users">
            <Users users={users} deleteUser={deleteUser} />
          </Route>
          <Route exact path="/users/:id">
            <DisplayData type="users" />
          </Route>
          <Route exact path="/users/:id/edit">
            <UserForm onUpdateUser={updateUser} />
          </Route>
          <Route exact path="/owners">
            <Owners owners={owners} deleteOwner={deleteOwner} />
          </Route>
          <Route exact path="/owners/:id">
            <DisplayData type="owners" />
          </Route>
          <Route exact path="/owners/:id/edit">
            <EditDataForm type="owners" onUpdateData={updateOwner} />
          </Route>
          <Route exact path="/properties/:id">
            <DisplayData type="properties" />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
