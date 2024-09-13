import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import ReactPaginate from "react-paginate";
import DisplayTableRow from "./DisplayTableRow";
import { isDate } from "./DataDisplayingFunctions";

const sortItems = (items, sortBy, sortOrder) => {
  return [...items].sort((a, b) => {
    if (isDate(sortBy)) {
      const dateA = new Date(a[sortBy]);
      const dateB = new Date(b[sortBy]);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    }
    if (a[sortBy] < b[sortBy]) return sortOrder === "asc" ? -1 : 1;
    if (a[sortBy] > b[sortBy]) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });
};

function DisplayTable({
  items,
  deleteItem,
  fields,
  defaultSortBy = "id",
  defaultSortOrder = "asc",
  type,
  view = "",
}) {
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(8);

  const [sortBy, setSortBy] = useState(defaultSortBy);
  const [sortOrder, setSortOrder] = useState(defaultSortOrder);
  const [searchQuery, setSearchQuery] = useState("");
  const [showInactive, setShowInactive] = useState(false);

  const filteredItems = items
    .filter((item) => {
      if ('is_active' in item) {
        if (!showInactive) {
          return item.is_active === true;
        } else {
          return true;
        }
      } else {
        return true
      }
    })
    .filter((item) => {
      return fields.some((field) =>
        item[field]
          ?.toString()
          .toLowerCase()
          .includes(searchQuery.toLowerCase()),
      );
    });
  const sortedItems = sortItems(filteredItems, sortBy, sortOrder);
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

  return (
    <div>
      <div>
        {view === "owner" || view === "tenant" ? (
          <span>
            {view.charAt(0).toUpperCase() + view.slice(1)} transactions
          </span>
        ) : type === "users" ? null : (
          <NavLink className="more" to={`/${type}/new`}>
            New{" "}
            {type === "properties"
              ? "Property"
              : type.charAt(0).toUpperCase() + type.slice(1, type.length - 1)}
          </NavLink>
        )}
        <div>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          {type === "tenants" || type === "owners" || type === "properties" ? (
            <label>
              Show Inactive {type.charAt(0).toUpperCase() + type.slice(1)} 
              <input
                type="checkbox"
                checked={showInactive}
                onChange={() => setShowInactive(!showInactive)}
              />
            </label>
          ) : null}
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort("id")}>Id</th>
            {fields.map((field) => (
              <th key={field} onClick={() => handleSort(field)}>
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </th>
            ))}
            <th>{view === "owner" || view === "tenant" ? null : "More"}</th>
          </tr>
        </thead>
        <tbody>
          {paginatedItems.map((item) => (
            <DisplayTableRow
              key={item.id}
              item={item}
              onDeleteItem={deleteItem}
              fields={fields}
              type={type}
              view={view}
            />
          ))}
        </tbody>
      </table>
      <ReactPaginate
        previousLabel={"Previous"}
        nextLabel={"Next"}
        breakLabel={"..."}
        pageCount={Math.ceil(items.length / pageSize)}
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
