import React from 'react';

const Home: React.FC = () => {
    return (
        <div>
            <h1>Welcome to the Canteen App</h1>
            <p>This is the home page.</p>
            <button onClick={() => {
                fetch('/hottopic/browse/topicList').then(res => {
                    res.json().then(value => console.log(value));
                })
            }}>Topic List</button>

            <button onClick={() => {
                fetch('/json/users').then(res => {
                    res.text().then(value => console.log(value));
                });
            }}>Json (users)</button>
            <button onClick={() => {
                fetch('/json/todos').then(res => {
                    res.text().then(value => console.log(value));
                });
            }}>Json (todos)</button>

            <button onClick={() => {
                fetch('/resources/site.json').then(res => {
                    res.text().then(value => console.log(value));
                });
            }}>Site</button>
        </div>
    );
};

export default Home;