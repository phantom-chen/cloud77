import React from 'react';
import Organization from './components/Organization';

const Company: React.FC = () => {
    return (
        <div>
            <h1>Company Page</h1>
            <p>Welcome to the Company page!</p>
            <Organization/>
        </div>
    );
};

export default Company;