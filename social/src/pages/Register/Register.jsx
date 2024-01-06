import React, { useState } from 'react';
import "./register.css";
function Register() {

  const [user, setUser] = useState({
    u_name: '',
    name: {
        first: '',
        last: ''
    },
    email: '',
    type: 'normal'
  });
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:8080/users/register', {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user,
        password
      })
    });

    console.log(user);
    const data = await response.json();
    console.log(data);

    if(data.success) {
      console.log('Registration successful!');
    } else {
      console.log('Registration failed!'); 
    }
  }
  const isDisabled = user.u_name.length === 0 || user.email.length === 0 ||user.name.first.length === 0 || 
  user.name.last.length === 0 || user.u_name.length === 0 || password.length === 0;
  
  return (
    <form className="register-form" onSubmit={handleSubmit}>
      
      <input 
        className='register-form input'
        type="text"
        placeholder="Username"
        value={user.u_name}
        onChange={(e) => setUser({...user, u_name: e.target.value})} 
      />

    <input
        className='register-form input'
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}  
      />

      <input
        className='register-form input'
        type="text" 
        placeholder="First Name"
        value={user.name.first}
        onChange={(e) => setUser({...user, name: {...user.name, first: e.target.value}})}
      />

      <input
        className='register-form input'
        type="text"
        placeholder="Last Name"
        value={user.name.last}
        onChange={(e) => setUser({...user, name: {...user.name, last: e.target.value}})}
      />

      <input
        className='register-form input'
        type="email"
        placeholder="Email"
        value={user.email}
        onChange={(e) => setUser({...user, email: e.target.value})}
      />

      <select 
        className='register-form select'
        value={user.type}
        onChange={(e) => setUser({...user, type: e.target.value})}
      >
        <option value="normal">Normal User</option>
        <option value="admin">Admin</option>
        <option value="smm">Social Media Manager</option>
      </select>

      <button 
        className="register-button"
        type="submit"
        disabled={isDisabled}   
      >
        Register
      </button>

    </form>
  );

}

export default Register;
