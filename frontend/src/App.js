import React, { useState } from 'react';
import Signup from './components/Signup';
import Login from './components/Login';
import ItemList from './components/Items';
import StaffList from './components/Stafflist';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [isSignup, setIsSignup] = useState(false); // To toggle between login and signup

  const saveToken = (newToken) => {
    setToken(newToken);
    localStorage.setItem('token', newToken); // Store token in localStorage for persistence
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('token'); // Remove token from localStorage
  };

  return (
    <div>
      {!token ? (
        <div>
          {isSignup ? (
            <Signup setToken={saveToken} />
          ) : (
            <Login setToken={saveToken} />
          )}
          <button onClick={() => setIsSignup(!isSignup)}>
            {isSignup ? 'Already have an account? Login' : 'Don’t have an account? Sign up'}
          </button>
        </div>
      ) : (
        <div>
          <button onClick={logout}>Logout</button> {/* Logout button */}
          <ItemList token={token} />
          <StaffList token={token} /> {/* Admin staff list */}
        </div>
      )}
    </div>
  );
}

export default App;
