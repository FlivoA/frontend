import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignUp.css';

const SignUp = ({ onSignUpSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const existingUser = JSON.parse(localStorage.getItem('users')) || [];

    if (existingUser.find((user) => user.email === email)) {
      setError('User already exists. Redirecting to Chatbot...');
      setTimeout(() => {
        navigate('/chatbot');
      }, 2000);
    } else if (password !== confirmPassword) {
      setError('Passwords do not match.');
    } else {
      const newUser = { email, username, password };
      existingUser.push(newUser);
      localStorage.setItem('users', JSON.stringify(existingUser)); // Save user to localStorage

      onSignUpSuccess(newUser);
      setEmail('');
      setUsername('');
      setPassword('');
      setConfirmPassword('');
      setError('');

      setTimeout(() => {
        navigate('/signin');
      }, 2000);
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
