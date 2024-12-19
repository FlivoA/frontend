import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate for redirecting
import './SignUp.css';

const SignUp = ({ onSignUpSuccess, users }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();  // Hook for navigation

  const handleSubmit = (e) => {
    e.preventDefault();

    const existingUser = (users || []).find((user) => user.email === email);

    if (existingUser) {
      setError('User already exists. Redirecting to Chatbot...');
      setTimeout(() => {
        navigate("/chatbot"); // Navigate to Chatbot if user already exists
      }, 2000); // Adding a delay to show the error message before redirect
    } else if (password !== confirmPassword) {
      setError('Passwords do not match.');
    } else {
      onSignUpSuccess({ email, username, password });
      setEmail('');
      setUsername('');
      setPassword('');
      setConfirmPassword('');
      setError('');

      // Redirect to the sign-in page after successful sign-up
      setTimeout(() => {
        navigate("/signin");
      }, 2000); // Add a short delay before navigating
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Username</label>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError('');
              }}
              required
            />
          </div>
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
          <div className="input-group">
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setError('');
              }}
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="signup-btn">Sign Up</button>
        </form>

        <p className="login-link">
          Already have an account? <a href="/signin">Log in here</a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
