import React, { useState } from 'react';
import User from './User';

function Users({ users, deleteUser }) {

    return (
        <div>
            <table>
                <tbody>
                    <tr>
                        <th>Id</th>
                        <th>Email</th>
                        <th>Name</th>
                        <th>Mobile</th>
                        <th>Is Accounts</th>
                        <th>More</th>
                    </tr>
                    {users.map(user => <User key={user.id} user={user} onDeleteUser={deleteUser} />)}
                </tbody>
            </table>
        </div>
    )
}

export default Users;