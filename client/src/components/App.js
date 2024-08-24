import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './Home';
import NavBar from './NavBar';
import SignupForm from './SignupForm';


function App() {
  const [users, setUsers] = useState([]);
  return (
    <Router>
      <div className="App">
        <NavBar />
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/signup">
            <SignupForm />
          </Route>
        </Switch>
      </div>
    </Router>
  )
}

export default App;
