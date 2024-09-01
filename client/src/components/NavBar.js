import React, { useState } from "react";
import { NavLink } from "react-router-dom";

function Navbar({ user, setUser }) {
  const [errorMessage, setErrorMessage] = useState("");

  function handleLogoutClick() {
    fetch("/logout", {
      method: "DELETE",
    }).then((r) => {
      if (r.ok) {
        setUser(null);
      } else {
        r.json().then((err) => setErrorMessage(err.message));
      }
    });
  }

  return (
    <nav>
      <p className="user">{user ? user.email : null}</p>
      <NavLink className="navbar" to="/" exact>
        Home
      </NavLink>
      <NavLink className="navbar" to="/users" exact>
        Users
      </NavLink>
      <NavLink className="navbar" to="/owners" exact>
        Owners
      </NavLink>
      <NavLink className="navbar" to="/properties" exact>
        Properties 
      </NavLink>
      <button className="navbar-button" onClick={handleLogoutClick}>
        Logout
      </button>
    </nav>
  );
}

export default Navbar;
