import React, { useCallback, useEffect, useState } from 'react';
import { ChartData, RawHTML } from './data';
import { Parser } from 'html-to-react'
import { SimpleChart } from './components/SimpleChart';

const Home: React.FC = () => {

    const [content, setContent] = useState('');
    const [tokens, setTokens] = useState<string>('');
    
    useEffect(() => {
        setContent(RawHTML);
    }, [])
    
    useEffect(() => {
        const token1 =sessionStorage.getItem('user_access_token');
        const token2 = sessionStorage.getItem('user_refresh_token');
        if (token1 && token2) {
            setTokens(`${token1},${token2}`);
        }
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

            <input
                type="text"
                placeholder="Tokens"
                value={tokens}
                onChange={(e) => {
                    setTokens(e.target.value);
                    console.log(e.target.value);
                    const tokens = e.target.value.split(',');
                    if (tokens.length > 0) {
                        sessionStorage.setItem('user_access_token', tokens[0]);
                    }
                    if (tokens.length > 1) {
                        sessionStorage.setItem('user_refresh_token', tokens[1])
                    }
                }}
            />

            <footer style={{ marginTop: '20px' }}>
                <p>&copy; 2024 Your Company. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Home;