import React, { useState } from 'react';
import './login.css';
function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

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
    } else {
      console.log("login failed!");
    }
  }

  return (
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

      <button className='login-form button' type="submit">Login</button>
    </form>
  );
}

export default Login;