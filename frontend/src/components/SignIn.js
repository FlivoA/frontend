import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate to handle redirect
import './SignIn.css';

const SignIn = ({ users, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize navigate function

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if the email and password match an existing user
    const user = (users || []).find(
      (user) => user.email === email && user.password === password
    );

    if (user) {
      // If login is successful, invoke onLoginSuccess callback and navigate to Chatbot
      onLoginSuccess(user);
      setError('');
      setEmail('');
      setPassword('');
      navigate('/chatbot');  // Redirect to Chatbot page
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="signin-container">
      <div className="signin-box">
        <h2>Sign In</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              required
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="signin-btn">Sign In</button>
        </form>

        <p className="signup-link">
          Don't have an account? <a href="/signup">Sign up here</a>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
