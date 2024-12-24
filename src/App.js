import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn"; 
import Chatbot from "./components/Chatbot";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Start with no authentication
  const [ setUserInfo] = useState(null);

  // Handle login success
  const handleLoginSuccess = (user) => {
    setIsAuthenticated(true);
    setUserInfo(user);
    console.log("User logged in successfully:", user);
  };

  // Handle sign-up success
  const handleSignUpSuccess = () => {
    alert("Signed up successfully!");
  };

  // Handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserInfo(null);
  };

  // Render the app
  return (
    <div className="App">
      {/* Check if the app is still loading authentication info */}
      <Routes>
        {/* SignUp Route */}
        <Route 
          path="/signup" 
          element={<SignUp onSignUpSuccess={handleSignUpSuccess} />} 
        />
        
        {/* SignIn Route */}
        <Route
          path="/signin"
          element={
            isAuthenticated ? (
              <Navigate to="/chatbot" />
            ) : (
              <SignIn onLoginSuccess={handleLoginSuccess} />
            )
          }
        />
        
        {/* Chatbot Route */}
        <Route
          path="/chatbot"
          element={isAuthenticated ? (
            <Chatbot onLogout={handleLogout} />
          ) : (
            <Navigate to="/signin" />
          )}
        />
        
        {/* Redirect root path to /signin */}
        <Route path="/" element={<Navigate to="/signin" />} />
      </Routes>
    </div>
  );
}

export default App;
