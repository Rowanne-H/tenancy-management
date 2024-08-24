import React from "react";
import { NavLink } from "react-router-dom";

function Navbar() {
    return (
        <nav>
            <NavLink className="navbar" to="/" exact>Home</NavLink>
        </nav>
    )
}

export default Navbar;