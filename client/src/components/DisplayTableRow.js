import React from 'react';
import { NavLink } from 'react-router-dom';

const ENDPOINTS = {
    users: '/users/',
    owners: '/owners/',
    properties: '/properties/',
    tenants: '/tenants/',
    rentals: '/rentals/',
    expenses: '/expenses/',
  };

function DisplayTableRow({ item, onDeleteItem, fields, type }) {

    function handleDeleteClick() {
        fetch(ENDPOINTS[type] + item.id, {
            method: "DELETE",
        })
            .then(r => {
                if (r.ok) {
                    onDeleteItem(item.id);
                    alert("Record has been deleted");
                    return r.json(item=>console.log(item));
                } else {
                    r.json().then(err=>alert(err.message));
                }
            });
    }

    const formatValue = (field, value) => {
        if (field === 'is_accounts' || field === 'is_active') {
          return value ? 'Yes' : 'No';
        }
        return value;
    }

    return (
        <tr>
             {fields.map(field => (
                <td key={field}>
                    {formatValue(field, item[field])}
                </td>
            ))}
            <td>
                <NavLink className="more" to={`/${type}/${item.id}`}>View</NavLink>
                <NavLink className="more" to={`/${type}/${item.id}/edit`}>Edit</NavLink>
                <button className="link-button" onClick={handleDeleteClick}>Delete</button>
            </td>
        </tr>
    )
}

export default DisplayTableRow;