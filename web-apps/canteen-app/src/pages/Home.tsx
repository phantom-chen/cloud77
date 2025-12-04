import React from 'react';
import Building from '../components/UnderBuild';

const Home: React.FC = () => {
    return (
        <div>
            <h1>Welcome to the Canteen Portal</h1>
            <p>This is the home page.</p>
            <Building />
        </div>
    );
};

export default Home;