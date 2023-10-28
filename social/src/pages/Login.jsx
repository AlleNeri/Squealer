import React, { useState, useContext, useEffect } from 'react';
import './login.css';
import { LoginContext } from './LoginContext';

function Login() {
  const { setLoggedIn } = useContext(LoginContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedInState] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('loggedIn');
    if (isLoggedIn) {
      setLoggedInState(true);
      setLoggedIn(true);
    }
  }, [setLoggedIn]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const response = await fetch("http://localhost:8080/users/login", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username,
        password  
      }) 
    });

    const data = await response.json();

    if (data.success) {
      console.log("login success!");
      setLoggedInState(true);
      setLoggedIn(true);
      localStorage.setItem('loggedIn', true);
    } else {
      console.log("login failed!");
    }
  }
  const isDisabled = username.length === 0 || password.length === 0;
  return (
    <>
      {loggedIn ? (
        <p>You are logged in!</p>
      ) : (
      <form className='login-form' onSubmit={handleSubmit}>
        <input
        className="login-form input"
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        className="login-form input"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}  
      />

      <button 
        className="login-button"
        type="submit"
        disabled={isDisabled}
      >
        Login
      </button>
    </form>
      )}
    </>
  );
}

export default Login;