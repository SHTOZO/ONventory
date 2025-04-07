import React, { useState } from 'react';
import axios from 'axios';

const Signup = ({ setToken }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [organization, setOrganization] = useState(''); // Keep track of the organization

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send the signup request with the username, password, and organization
      const response = await axios.post('http://localhost:5000/api/auth/signup', { username, password, organization });
      setToken(response.data.token); // Store the token in the parent component (App.js)
    } catch (error) {
      console.error('Sign up failed:', error);
      alert('Sign up failed');
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="text"
          placeholder="Organization"
          value={organization}
          onChange={(e) => setOrganization(e.target.value)} // Update organization state
        />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;