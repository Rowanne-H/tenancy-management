import React from 'react';
import Owner from './Owner';
import DisplayTable from './DisplayTable';

function Owners({ owners, deleteOwner }) {
    const fields = ['id', 'ref', 'name', 'email', 'mobile', 'address', 'management_commencement_date', 'management_end_date', 'is_ative'];
    
    return (
        <DisplayTable 
            items={owners}
            deleteItem={deleteOwner} 
            fields={fields}
            defaultSortBy="name"
            type="owners"
        />
    );
}

export default Owners;
