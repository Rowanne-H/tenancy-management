import React from "react";
import { NavLink } from "react-router-dom";

function Navbar() {
    return (
        <nav>
            <NavLink className="navbar" to="/" exact>Home</NavLink>
            <NavLink className="navbar" to="/signup" exact>Sign Up</NavLink>
            <NavLink className="navbar" to="/users" exact>Users</NavLink>
        </nav>
    )
}

export default Navbar;