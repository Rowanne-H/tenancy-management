import React from 'react';
import { NavLink } from 'react-router-dom';

function User({ user, onDeleteUser }) {
    const { id, email, name, mobile, is_accounts } = user

    function handleDeleteClick() {
        fetch(`/users/${id}`, {
            method: "DELETE",
        })
            .then(r => {
                if (r.ok) {
                    onDeleteUser(id);
                    alert("Account " + email + " has been deleted");
                    return r.json();
                } else {
                    r.json().then(err=>alert(err.message));
                }
            });
    }

    return (
        <tr>
            <td>{id}</td>
            <td>{email}</td>
            <td>{name}</td>
            <td>{mobile}</td>
            <td>{is_accounts ? 'Yes' : 'No'}</td>
            <td>
                <NavLink className="more" to={`/users/${id}`}>View</NavLink>
                <NavLink className="more" to={`/users/${id}/edit`}>Edit</NavLink>
                <NavLink className="more" to={`/users`} onClick={handleDeleteClick}>Delete</NavLink>
            </td>
        </tr>
    )
}

export default User;