// DisplayComponent.js
import React, { useEffect, useState } from 'react';

import { useParams} from 'react-router-dom';

// Define a mapping of object types to their fetch endpoints
const ENDPOINTS = {
  property: '/properties/',
  user: '/users/',
  owner: '/api/owners/',
  tenant: '/api/tenants/',
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
    property: ['id', 'address', 'price'],
    user: ['id', 'name', 'email', 'mobile'],
    owner: ['id', 'name', 'contact'],
    tenant: ['id', 'name', 'leaseStart', 'leaseEnd'],
  };

  const fields = FIELD_MAPPINGS[type];

  return (
    <div>
      <h2>{type.charAt(0).toUpperCase() + type.slice(1)} Details</h2>
      <ul>
        {fields.map(field => (
          <li key={field}>
            <strong>{field.charAt(0).toUpperCase() + field.slice(1)}:</strong> {data[field]}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DisplayData;