import React, { useState } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { formatValue, getIdValue } from "./DataDisplayingFunctions";

function Navbar({ user, setUser, owners, properties, tenants }) {
  const [peopleDropDownMenu, setPeopleDropDownMenu] = useState(false);
  const [search, setSearch] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [userDropDownMenu, setUserDropDownMenu] = useState(false);
  const userIcon = user.name.split(" ")[0][0] + user.name.split(" ")[1][0];

  const ownersFields = ["ref", "name", "email", "mobile"];
  const tenantsFields = ["ref", "name", "email"];
  const propertiesFields = ["ref", "address", "owner_id", "tenant_id"];

  const filteredOwners = owners.filter((item) => {
    return ownersFields.some((field) => {
      let searchItem = item[field];
      return searchItem
        ?.toString()
        .toLowerCase()
        .includes(search.toLowerCase());
    });
  });
  const filteredTenants = tenants.filter((item) => {
    return tenantsFields.some((field) => {
      let searchItem = item[field];
      return searchItem
        ?.toString()
        .toLowerCase()
        .includes(search.toLowerCase());
    });
  });

  const filteredProperties = properties.filter((item) => {
    return propertiesFields.some((field) => {
      let searchItem = item[field];
      return searchItem
        ?.toString()
        .toLowerCase()
        .includes(search.toLowerCase());
    });
  });

  const history = useHistory();

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

  function getActiveTenant(items, id) {
    let activeTenant = items.filter((item) => item.property_id == id);
    if (activeTenant.length > 0) {
      return activeTenant[0].name;
    } else {
      return "Null";
    }
  }
  console.log(filteredOwners);

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
          value={search}
          onBlur={() => setIsFocused(false)}
          onChange={(e) => setSearch(e.target.value)}
        />
        <i className="fas fa-remove" onClick={() => setSearch("")}></i>
        {search ? (
          <div className="search-dropdown-menu">
            <ul>
              {filteredOwners.map((item) => (
                <li
                  key={item.id}
                  onClick={() => history.push(`/owners/${item.id}`)}
                >
                  <div>
                    <strong>Owner: </strong>
                    {item.name}
                  </div>
                  Ref: {item.ref} &nbsp;&nbsp;&nbsp; Mobile: {item.mobile}{" "}
                  &nbsp;&nbsp;&nbsp; Email: {item.email}
                </li>
              ))}
              {filteredTenants.map((item) => (
                <li
                  key={item.id}
                  onClick={() => history.push(`/tenants/${item.id}`)}
                >
                  <div>
                    <strong>Tenant: </strong>
                    {item.name}
                  </div>
                  Ref: {item.ref} &nbsp;&nbsp;&nbsp; Mobile:{item.mobile}{" "}
                  &nbsp;&nbsp;&nbsp; Email: {item.email}
                </li>
              ))}
              {filteredProperties.map((item) => (
                <li
                  key={item.id}
                  onClick={() => history.push(`/properties/${item.id}`)}
                >
                  <div>
                    <strong>Property: </strong>
                    {item.address}
                  </div>
                  Ref: {item.ref} &nbsp;&nbsp;&nbsp; Owner:{" "}
                  {getIdValue(owners, "owner_id", item.owner_id)}{" "}
                  &nbsp;&nbsp;&nbsp; Tenant: {getActiveTenant(tenants, item.id)}
                  {item.tenant_id}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
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
            <p
              className="user-dropdown-item link"
              onClick={() => history.push(`/users/${user.id}`)}
            >
              View my profile
            </p>
            <p
              className="user-dropdown-item link"
              onClick={() => history.push(`/users/${user.id}/edit`)}
            >
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
