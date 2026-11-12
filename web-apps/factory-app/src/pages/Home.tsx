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

            <textarea
                placeholder="Tokens (access,refresh)"
                value={tokens}
                onChange={(e) => {
                    setTokens(e.target.value);
                    console.log(e.target.value);
                    const parts = e.target.value.split(',');
                    if (parts.length > 0) {
                        sessionStorage.setItem('user_access_token', parts[0]);
                    }
                    if (parts.length > 1) {
                        sessionStorage.setItem('user_refresh_token', parts[1]);
                    }
                }}
                style={{
                    width: '80%',
                    minWidth: '480px',
                    maxWidth: '95%',
                    height: '80px',
                    resize: 'vertical',
                    padding: '8px',
                    fontFamily: 'inherit',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                }}
            />

            <footer style={{ marginTop: '20px' }}>
                <p>&copy; 2024 Your Company. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Home;