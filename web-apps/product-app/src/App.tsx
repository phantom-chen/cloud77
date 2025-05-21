import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { Tester } from './pages/Tester';

function App() {

  useEffect(() => {
    fetch('/api/gateway').then(res => {
      res.json().then(value => console.log(value));
    });
    fetch('api/gateway').then(res => {
      res.json().then(value => console.log(value));
    });
  }, [])

  return (
    <div className="App">
      {/* <header className="App-header">
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
      <Tester/>
    </div>
  );
}

export default App;
