import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import SignUp from "./components/SignUp";  // Import SignUp component
import SignIn from "./components/SignIn";  // Import SignIn component
import Chatbot from "./components/Chatbot";  // Import Chatbot component

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [users, setUsers] = useState([
    { email: "admin@example.com", username: "admin", password: "123" },  // Dummy user data
  ]);

  // Handle login success
  const handleLoginSuccess = (user) => {
    setIsAuthenticated(true);  // Set authentication status to true
    console.log('User logged in successfully:', user);
  };

  // Handle sign-up success
  const handleSignUpSuccess = (newUser) => {
    setUsers((prevUsers) => [...prevUsers, newUser]);  // Add the new user to the users list
    alert("Signed up successfully!");
  };

  return (
    <Router>
      <div className="App">
        {/* Navbar or Links */}
        <nav>
          <ul>
            <li>
              <Link to="/signup">Sign Up</Link>
            </li>
            <li>
              <Link to="/signin">Sign In</Link>
            </li>
          </ul>
        </nav>

        {/* Routes for the app */}
        <Routes>
          <Route 
            path="/signup" 
            element={<SignUp onSignUpSuccess={handleSignUpSuccess} users={users} />} 
          />
          <Route 
            path="/signin" 
            element={<SignIn onLoginSuccess={handleLoginSuccess} users={users} />} 
          />
          <Route 
            path="/chatbot" 
            element={isAuthenticated ? <Chatbot /> : <Navigate to="/signin" />} 
          />
          <Route path="/" element={<Navigate to="/signin" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
