import React from 'react';
import { NavLink } from 'react-router-dom';

function User({ user }) {
    const { id, email, name, mobile, is_accounts } = user

    return (
        <tr>
            <td>{id}</td>
            <td>{email}</td>
            <td>{name}</td>
            <td>{mobile}</td>
            <td>{mobile}</td>
            <td>{is_accounts}</td>
        </tr>
    )
}

export default User;