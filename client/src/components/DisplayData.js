import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ENDPOINTS, FIELD_MAPPINGS } from "./MappingData";

const DisplayData = ({ type }) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const { id } = useParams();

  useEffect(() => {
    if (id && type && ENDPOINTS[type]) {
      fetch(ENDPOINTS[type] + id)
        .then((r) => {
          if (!r.ok) {
            throw new Error("Network response was not ok");
          }
          return r.json();
        })
        .then((data) => setData(data))
        .catch((error) => setError(error));
    }
  }, [id, type]);

  if (error) return <p>Error: {error.message}</p>;
  if (!data) return <p>Loading...</p>;

  const fields = FIELD_MAPPINGS[type];

  const formatValue = (field, value) => {
    if (field === "is_accounts" || field === "is_active") {
      return value ? "Yes" : "No";
    }
    if (!value) {
      return "null";
    }
    if (
      field === "created_at" ||
      field === "payment_date" ||
      field === "management_end_date" ||
      field === "management_start_date" ||
      field === "lease_start_date" ||
      field === "lease_end_date"
    ) {
      const date = new Date(value).toISOString().split("T")[0];
      return date;
    }
    return value;
  };

  return (
    <div>
      <h2>
        {type.charAt(0).toUpperCase() + type.slice(1, type.length - 1)} Details
      </h2>
      <ul>
        {fields.map((field) => (
          <li key={field}>
            <strong>{field.charAt(0).toUpperCase() + field.slice(1)}:</strong>{" "}
            {formatValue(field, data[field])}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DisplayData;
