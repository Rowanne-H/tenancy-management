import React, { useState } from "react";
import { NavLink, useHistory } from "react-router-dom";

function Navbar({ user, setUser }) {
  const [peopleDropDownMenu, setPeopleDropDownMenu] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const [userDropDownMenu, setUserDropDownMenu] = useState(false);
  const userIcon = user.name.split(" ")[0][0] + user.name.split(" ")[1][0];

  const history = useHistory();

  function handleViewClick() {
    history.push(`/users/${user.id}`);
  }

  function handleEditClick() {
    history.push(`/users/${user.id}/edit`);
  }

  function handleLogoutClick() {
    fetch("/logout", {
      method: "DELETE",
    }).then((r) => {
      if (r.ok) {
        setUser(null);
      } else {
        r.json().then((err) => alert(err.message));
      }
    });
  }

  return (
    <nav>
      <div className="main-menu">
        <NavLink className="navbar" to="/" exact>
          Home
        </NavLink>
        <div
          className="people-menu"
          onClick={() => setPeopleDropDownMenu(!peopleDropDownMenu)}
        >
          <i className="fas fa-user-friends"></i>
          People
          <i className="fas fa-angle-down"></i>
          {peopleDropDownMenu ? (
            <div className="people-dropdown-menu">
              <NavLink
                className="navbar people-dropdown-item"
                to="/owners"
                exact
              >
                Owners
              </NavLink>
              <NavLink
                className="navbar people-dropdown-item"
                to="/tenants"
                exact
              >
                Tenants
              </NavLink>
              <NavLink
                className="navbar people-dropdown-item"
                to="/creditors"
                exact
              >
                Creditors
              </NavLink>
              <NavLink
                className="navbar people-dropdown-item"
                to="/users"
                exact
              >
                Users
              </NavLink>
            </div>
          ) : null}
        </div>
        <NavLink className="navbar" to="/properties" exact>
          <i className="fas fa-home"></i>
          Properties
        </NavLink>
        <NavLink className="navbar" to="/transactions" exact>
          <i className="fas fa-dollar"></i>
          Transactions
        </NavLink>
      </div>
      <div className={`nav-search-bar ${isFocused ? "focused" : ""}`}>
        <i className="fas fa-search"></i>
        <input
          type="text"
          placeholder="Search by ref, name, address, email or mobile"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </div>

      <div
        className="user-menu"
        onClick={() => setUserDropDownMenu(!userDropDownMenu)}
      >
        <div className="user-icon">{userIcon}</div>
        {userDropDownMenu ? (
          <div className="user-dropdown-menu">
            <p className="user-dropdown-item">{user ? user.name : null}</p>
            <p className="user-dropdown-item">{user ? user.email : null}</p>
            <p className="user-dropdown-item link" onClick={handleViewClick}>
              View my profile
            </p>
            <p className="user-dropdown-item link" onClick={handleEditClick}>
              Edit my profile
            </p>
            <p className="user-dropdown-item link" onClick={handleLogoutClick}>
              <i className="fas fa-sign-out"></i>Sign out
            </p>
          </div>
        ) : null}
      </div>
    </nav>
  );
}

export default Navbar;
