import React, { useCallback, useEffect, useState } from 'react';
import { ChartData, RawHTML } from './data';
import { Parser } from 'html-to-react'
import { SimpleChart } from './components/SimpleChart';

const Home: React.FC = () => {

    const [content, setContent] = useState('');

    useEffect(() => {
        setContent(RawHTML);
    }, [])
    
    const chartClickHandler = useCallback(() => {
        console.log("chart click works");
    }, []);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <h2>Welcome to the Home Page</h2>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
               
                {Parser().parse(content)}

                <p>-------space------</p>

                <div style={{ width: '300px' }}>
                    <SimpleChart data={ChartData} onClick={chartClickHandler}/> 
                </div>
            </div>

            <footer style={{ marginTop: '20px' }}>
                <p>&copy; 2024 Your Company. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Home;