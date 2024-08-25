import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import Home from './Home';
import NavBar from './NavBar';
import Users from './Users';
import SignupForm from './SignupForm';


function App() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    fetch("/users")
      .then(r => r.json())
      .then(users => {
        setUsers(users);
        console.log(users);
      });
  }, []);

  if (users === []) return <h3>Loading...</h3>

  return (
    <Router>
      <div className="App">
        <NavBar />
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/signup">
            <SignupForm users={users} />
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
