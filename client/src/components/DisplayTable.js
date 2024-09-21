import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ReactPaginate from "react-paginate";
import DisplayTableRow from "./DisplayTableRow";
import {
  formatTitleValue,
  isDate,
  getIdValue,
} from "./DataDisplayingFunctions";

function DisplayTable({
  items,
  fields,
  defaultSortBy = "id",
  defaultSortOrder = "asc",
  type,
  view = "",
  item = {},
  user,
  users = [],
  properties = [],
  owners = [],
}) {
  console.log("Table");
  console.log(users);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const [sortBy, setSortBy] = useState(defaultSortBy);
  const [sortOrder, setSortOrder] = useState(defaultSortOrder);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [showInactive, setShowInactive] = useState(false);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const filteredItems = items
    .filter((item) => {
      if ("is_active" in item) {
        if (!showInactive) {
          return item.is_active === true;
        } else {
          return true;
        }
      } else {
        return true;
      }
    })
    .filter((item) => {
      if (startDate || endDate) {
        const itemDate = new Date(item.payment_date);
        if (startDate && endDate) {
          return (
            itemDate >= new Date(startDate) && itemDate <= new Date(endDate)
          );
        }
        if (startDate) {
          return itemDate >= new Date(startDate);
        }
        if (endDate) {
          return itemDate <= new Date(endDate);
        }
      }
      return true;
    })
    .filter((item) => {
      return fields.some((field) =>
        item[field]
          ?.toString()
          .toLowerCase()
          .includes(searchQuery.toLowerCase()),
      );
    });
  const sortItems = (items, sortBy, sortOrder) => {
    return [...items].sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      if (isDate(sortBy)) {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      if (sortBy === "user_id") {
        aValue = getIdValue(users, "user_id", a["user_id"]);
        bValue = getIdValue(users, "user_id", b["user_id"]);
      }
      if (sortBy === "owner_id") {
        aValue = getIdValue(owners, "owner_id", a["owner_id"]);
        bValue = getIdValue(owners, "owner_id", b["owner_id"]);
      }
      if (sortBy === "property_id") {
        aValue = getIdValue(properties, "property_id", a["property_id"]);
        bValue = getIdValue(properties, "property_id", b["property_id"]);
      }
      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  };
  const sortedItems = sortItems(filteredItems, sortBy, sortOrder);
  const totalPages = Math.ceil(filteredItems.length / pageSize);
  const paginatedItems = sortedItems.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize,
  );

  const handleSort = (field) => {
    setSortBy(field);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(0); // Reset to first page on search
  };

  const history = useHistory();
  const handleNewDataClick = () => {
    if (
      (type === "transactions" || type === "creditors") &&
      !user.is_accounts
    ) {
      alert("Only accounts can perform this action");
    } else {
      history.push(`/${type}/new`);
    }
  };

  return (
    <div className="display-table-container">
      <div className="display-table-header">
        {view === "owner" || view === "tenant" || view === "user" ? (
          <p className="display-table-description-text">
            {view === "user"
              ? `Owners of Properties Managed by ${item.name}`
              : type === "transactions"
                ? item.name + "'s " + formatTitleValue(view) + " Statement"
                : "Properties Owned by " + item.name}
          </p>
        ) : type === "users" ? (
          <div className="users-space"></div>
        ) : (
          <div className="add-new">
            <button onClick={handleNewDataClick}>
              + New{" "}
              {type === "properties"
                ? "Property"
                : type.charAt(0).toUpperCase() + type.slice(1, type.length - 1)}
            </button>
          </div>
        )}
        {
          <div className="search-section">
            <div className="search-by">
              <span>{formatTitleValue(type)}: </span>
              <span className={`search-bar ${isFocused ? "focused" : ""}`}>
                <i className="fas fa-search"></i>
                <input
                  type="text"
                  placeholder={"Filter " + type}
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                />
              </span>
            </div>
            &nbsp;&nbsp;
            {type === "transactions" ? (
              <div className="search-by">
                <label className="search-date">
                  Payment From
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </label>
                <label className="search-date">
                  To
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </label>
              </div>
            ) : (
              <div className="search-by">
                <label>
                  Show Inactive {formatTitleValue(type)}
                  <input
                    className="check-box"
                    type="checkbox"
                    checked={showInactive}
                    onChange={() => setShowInactive(!showInactive)}
                  />
                </label>
              </div>
            )}
          </div>
        }
      </div>
      <table>
        <thead>
          <tr>
            {fields.map((field) => (
              <th key={field} onClick={() => handleSort(field)}>
                {formatTitleValue(field)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedItems.map((item) => (
            <DisplayTableRow
              key={item.id}
              item={item}
              fields={fields}
              type={type}
              view={view}
              users={users}
              properties={properties}
              owners={owners}
            />
          ))}
        </tbody>
      </table>
      <ReactPaginate
        previousLabel={"Previous"}
        nextLabel={"Next"}
        breakLabel={"..."}
        pageCount={totalPages}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageClick}
        containerClassName={"pagination"}
        pageClassName={"page-item"}
        pageLinkClassName={"page-link"}
        previousClassName={"page-item"}
        previousLinkClassName={"page-link"}
        nextClassName={"page-item"}
        nextLinkClassName={"page-link"}
        breakClassName={"page-item"}
        breakLinkClassName={"page-link"}
        activeClassName={"active"}
      />
    </div>
  );
}

export default DisplayTable;
