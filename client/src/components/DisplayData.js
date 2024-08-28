// DisplayComponent.js
import React, { useEffect, useState } from 'react';
import { useParams} from 'react-router-dom';

// Define a mapping of object types to their fetch endpoints
const ENDPOINTS = {
  user: '/users/',
  owner: '/owners/',
  property: '/properties/',
  tenant: '/tenants/',
  rental: '/rentals/',
  expenses: '/expenses/',
};

const DisplayData = ({ type }) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const { id } = useParams();

  useEffect(() => {
    if (id && type && ENDPOINTS[type]) {
      fetch(ENDPOINTS[type] + id)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => setData(data))
        .catch(error => setError(error));
    }
  }, [id, type]);

  if (error) return <p>Error: {error.message}</p>;
  if (!data) return <p>Loading...</p>;

  // Define field mappings as in the previous example
  const FIELD_MAPPINGS = {
    user: ['id', 'name', 'email', 'mobile', 'is_accounts'],
    owner: ['id', 'ref', 'name', 'email', 'mobile', 'address', 'note', 
      'management_end_date', 'management_commencement_date', 'is_active' ],
    property: ['id', 'ref', 'address', 'commission', 'letting_fee', 
      'user_id', 'owner_id', 'is_active' ],
    tenant: ['id', 'ref', 'name', 'email', 'mobile', 'note', 'lease_term', 
      'lease_start_date', 'lease_end_date', 'rent', 'vacating_date', 
      'property_id', 'is_active'],
    rental: ['id', 'amount', 'created_at', 'payment_date',
            'description', 'tenant_id'],
    expense: ['id', 'amount', 'created_at', 'payment_date',
      'description', 'tenant_id'] 
  };

  const fields = FIELD_MAPPINGS[type];

  const formatValue = (field, value) => {
    if (field === 'is_accounts' || field === 'is_active') {
      return value ? 'Yes' : 'No';
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