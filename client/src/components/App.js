import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import Home from './Home';
import NavBar from './NavBar';
import Users from './Users';
import Login from "./Login";
import SignupForm from './SignupForm';


function App() {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // auto-login
    fetch("/check_session")
      .then((r) => {
        if (r.ok) {
          r.json().then(user => setUser(user));
        }
      });
  }, []);

  useEffect(() => {
    fetch("/users")
      .then(r => r.json())
      .then(users => {
        setUsers(users);
        console.log(users);
      });
  }, []);

  function addNewUser(newUser) {
    setUsers([...users, newUser])
  }

  if (!user) return <Login onLogin={setUser} onAddNewUser={addNewUser}/>;  

  return (
    <Router>
      <div className="App">
        <NavBar user={user} setUser={setUser} />
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/users">
            <Users users={users} />
          </Route>
        </Switch>
      </div>
    </Router>
  )
}

export default App;
