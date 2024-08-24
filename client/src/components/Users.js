import React, { useState } from 'react';
import User from './User';

function Users({ users }) {
    
    return (
        <div>
            <table>
                <tbody>
                    <tr>
                        <th>Id</th>
                        <th>Email</th>
                        <th>Name</th>
                        <th>Mobile</th>
                        <th>Email</th>
                        <th>Is Accounts</th>
                    </tr>
                    {users.map(user => <User key={user.id} user={user} />)}
                </tbody>
            </table>
        </div>
    )
}

export default Users;