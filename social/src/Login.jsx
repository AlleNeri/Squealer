import React, { useState } from 'react';
import './login.css'
function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // send login request
  }

  return (
    <form class='login-form' onSubmit={handleSubmit}>
      <label class='login-form label'>
        Username:
        <input 
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)} 
        />
      </label>

      <label class='login-form label'>
        Password: 
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>

      <button class='login-form button' type="submit">Login</button>
    </form>
  );
}

export default Login;