import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import Home from './Home';
import NavBar from './NavBar';
import Users from './Users';
import Login from "./Login";
import UserForm from './UserForm';
import DisplayData from "./DisplayData";

function App() {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // auto-login
    fetch("/check_session")
      .then((r) => {
        if (r.ok) {
          r.json().then(user => {
            fetch("/users")
            .then(r => r.json())
            .then(users => {
              setUsers(users);
            });
          });
        }
      });
  }, [user]);

 
  function addNewUser(newUser) {
    setUsers([...users, newUser])    
  }

  function updateUser(updatedUser) {
    setUsers(users.map(user => user.id === updatedUser ? updatedUser : user))
  }

  function deleteUser(id) {
    setUsers(users.filter(user => user.id !== id))
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
          <Route exact path="/users/:id/">
            <DisplayData type="user" />
          </Route>
          <Route exact path="/properties/:id/">
            <DisplayData type="property" />
          </Route>
          <Route exact path="/users/:id/edit">
            <UserForm onUpdateUser={updateUser} />
          </Route>
          <Route exact path="/users">
            <Users users={users} deleteUser={deleteUser} />
          </Route>
        </Switch>
      </div>
    </Router>
  )
}

export default App;
