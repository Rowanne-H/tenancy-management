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
        if (field === 'created_at' ||
            field === 'payment_date' ||
            field === 'management_end_date' ||
            field === 'management_commencement_date' ||
            field === 'lease_start_date' ||
            field === 'lease_end_date') {
            return new Date(value).toISOString().split('T')[0];
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