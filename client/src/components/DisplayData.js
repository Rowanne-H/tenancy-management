// DisplayComponent.js
import React, { useEffect, useState } from 'react';
import { useParams} from 'react-router-dom';

// Define a mapping of object types to their fetch endpoints
const ENDPOINTS = {
  users: '/users/',
  owners: '/owners/',
  properties: '/properties/',
  tenants: '/tenants/',
  rentals: '/rentals/',
  expenses: '/expenses/',
};

const DisplayData = ({ type }) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const { id } = useParams();

  useEffect(() => {
    if (id && type && ENDPOINTS[type]) {
      fetch(ENDPOINTS[type] + id)
        .then(r => {
          if (!r.ok) {
            throw new Error('Network response was not ok');
          }
          return r.json();
        })
        .then(data => setData(data))
        .catch(error => setError(error));
    }    
  }, [id, type]);

  if (error) return <p>Error: {error.message}</p>;
  if (!data) return <p>Loading...</p>;

  // Define field mappings as in the previous example
  const FIELD_MAPPINGS = {
    users: ['id', 'name', 'email', 'mobile', 'is_accounts'],
    owners: ['id', 'ref', 'name', 'email', 'mobile', 'address', 'note', 
      'management_end_date', 'management_commencement_date', 'is_active' ],
    properties: ['id', 'ref', 'address', 'commission', 'letting_fee', 
      'user_id', 'owner_id', 'is_active' ],
    tenants: ['id', 'ref', 'name', 'email', 'mobile', 'note', 'lease_term', 
      'lease_start_date', 'lease_end_date', 'rent', 'vacating_date', 
      'property_id', 'is_active'],
    rentals: ['id', 'amount', 'created_at', 'payment_date',
            'description', 'tenant_id'],
    expenses: ['id', 'amount', 'created_at', 'payment_date',
      'description', 'tenant_id'] 
  };

  const fields = FIELD_MAPPINGS[type];

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
    <div>
      <h2>{type.charAt(0).toUpperCase() + type.slice(1)} Details</h2>
      <ul>
        {fields.map(field => (
          <li key={field}>
            <strong>{field.charAt(0).toUpperCase() + field.slice(1)}:</strong> {formatValue(field, data[field])}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DisplayData;