import React, { useState } from "react";
import { NavLink } from "react-router-dom";

function Navbar({ setUser }) {
    const [errorMessage, setErrorMessage] = useState("");

    function handleLogoutClick() {
        fetch("/logout", {
            method: "DELETE"
        }).then(r => {
            if (r.ok) {
                setUser(null);
            } else {
                r.json().then(err=>setErrorMessage(err.message));
            }
        })
    }

    return (
        <nav>
            <NavLink className="navbar" to="/" exact>Home</NavLink>
            <NavLink className="navbar" to="/users" exact>Users</NavLink>
            <button className="navbar-button" onClick={handleLogoutClick}>Logout</button>
        </nav>
    )
}

export default Navbar;