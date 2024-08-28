import React, { useState } from 'react';
import User from './User';
import ReactPaginate from 'react-paginate';

const sortUsers = (users, sortBy, sortOrder) => {
    return [...users].sort((a, b) => {
        if (a[sortBy] < b[sortBy]) return sortOrder === 'asc' ? -1 : 1;
        if (a[sortBy] > b[sortBy]) return sortOrder === 'asc' ? 1 : -1;
        return 0;
    });
};

function Users({ users, deleteUser }) {
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    const [sortBy, setSortBy] = useState('name'); // Default sort by 'name'
    const [sortOrder, setSortOrder] = useState('asc'); 

    const sortedUsers = sortUsers(users, sortBy, sortOrder);
    const paginatedUsers = sortedUsers.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

    const handleSort = (field) => {
        setSortBy(field);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    const handlePageClick = (data) => {
        setCurrentPage(data.selected);
    };

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th onClick={() => handleSort('id')}>Id</th>
                        <th onClick={() => handleSort('email')}>Email</th>
                        <th onClick={() => handleSort('name')}>Name</th>
                        <th onClick={() => handleSort('mobile')}>Mobile</th>
                        <th>Is Accounts</th>
                        <th>More</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedUsers.map(user => <User key={user.id} user={user} onDeleteUser={deleteUser} />)}
                </tbody>
            </table>
            <ReactPaginate
                previousLabel={'Previous'}
                nextLabel={'Next'}
                breakLabel={'...'}
                pageCount={Math.ceil(users.length / pageSize)}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageClick}
                containerClassName={'pagination'}
                pageClassName={'page-item'}
                pageLinkClassName={'page-link'}
                previousClassName={'page-item'}
                previousLinkClassName={'page-link'}
                nextClassName={'page-item'}
                nextLinkClassName={'page-link'}
                breakClassName={'page-item'}
                breakLinkClassName={'page-link'}
                activeClassName={'active'}
            />
        </div>
    )
}

export default Users;