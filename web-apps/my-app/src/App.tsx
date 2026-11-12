import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {

  const [username, setUserName] = useState<string>(sessionStorage.getItem('email') ?? '');
  const [password, setPassword] = useState<string>('');
  const [token, setToken] = useState<string>(sessionStorage.getItem('access-token') ?? '')
  const [token2, setToken2] = useState<string>(sessionStorage.getItem('refresh-token') ?? '')
  const [message, setMessage] = useState<string>('')

  useEffect(() => {
    fetch('/api/gateway').then(res => {
      res.json().then(data => {
        console.log(data)
        if (!sessionStorage.getItem('key')) {
          sessionStorage.setItem('key', data.key)
        }
      })
    })
  }, []);

  useEffect(() => {
    // check token is valid
    fetch('/api/sso/tokens/validation', {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': sessionStorage.getItem('key') ?? '',
        'Authorization': 'Bearer ' + sessionStorage.getItem('access-token') ?? ''
      }
    }).then(res => {
      res.json().then(data => {
        console.log(data)
        setMessage(data.code + '\n' + data.message)
      })
    })
  }, [token])

  return (
    <div className="App">
      <div>
        <input placeholder='user name or email' value={username} onChange={e => { setUserName(e.target.value) }} />
        <input placeholder='user password' value={password} onChange={e => { setPassword(e.target.value) }} />
        <button onClick={() => {
          console.log('login')
          sessionStorage.setItem('email', username);
          fetch('/api/sso/tokens', {
            method: 'Post',
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': sessionStorage.getItem('key') ?? ''
            },
            body: JSON.stringify({
              email: username,
              password
            })
          }).then(res => res.json().then(data => {
            console.log(data)
            console.log(data.value);
            console.log(data.refreshToken);
            sessionStorage.setItem('access-token', data.value)
            sessionStorage.setItem('refresh-token', data.refreshToken)
            setToken(data.value)
            setToken2(data.refreshToken)
          }))
        }}>login</button>
      </div>

      <div>
        <textarea readOnly value={token} />
      </div>
      <div>
        <textarea readOnly value={token2} />
      </div>
      <p>{message}</p>
      <header className="App-header" style={{ display: 'none' }}>
        <img src={logo} className="App-logo" alt="logo" />
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
      </header>
    </div>
  );
}

export default App;
