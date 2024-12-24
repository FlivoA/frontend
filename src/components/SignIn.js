import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { MsalProvider, useMsal } from "@azure/msal-react";
import { msalInstance } from "./msalConfig"; // Ensure msalConfig.js is set up correctly
import "./SignIn.css";

const SignIn = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [microsoftAccounts, setMicrosoftAccounts] = useState([]);
  const navigate = useNavigate();

  const CLIENT_ID =
    "684571344021-on0rmfoq0h7vslifsdvge5auo38fhn5j.apps.googleusercontent.com"; // Replace with your Google client ID

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Invalid email format");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find((u) => u.email === email);

    if (!user) {
      setError("User not found. Please sign up.");
      return;
    }

    if (user.password !== password) {
      setError("Incorrect password. Please try again.");
      return;
    }

    onLoginSuccess(user);
    setError("");
    navigate("/chatbot");
  };

  const handleGoogleSuccess = (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const user = {
        email: decoded.email,
        name: decoded.name,
        googleId: decoded.sub,
      };
      onLoginSuccess(user);
      setError("");
      navigate("/chatbot");
    } catch (error) {
      console.error("Google Sign-In error:", error);
      setError("Google Sign-In failed. Please try again.");
    }
  };

  // Microsoft login logic
  const MicrosoftLoginButton = () => {
    const { instance } = useMsal();

    const handleMicrosoftLogin = async () => {
      const accounts = instance.getAllAccounts();
      if (accounts.length > 0) {
        setMicrosoftAccounts(accounts); // Display available accounts to the user
        return;
      }

      try {
        // Redirect to Microsoft login page
        await instance.loginRedirect({
          scopes: ["User.Read"], // You can include more scopes as needed
        });
      } catch (error) {
        console.error("Microsoft Sign-In error:", error);
        setError("Microsoft Sign-In failed. Please try again.");
      }
    };

    useEffect(() => {
      const handleRedirectResponse = async () => {
        try {
          const response = await instance.handleRedirectPromise();
          if (response) {
            const user = {
              email: response.account.username,
              name: response.account.name,
              microsoftId: response.account.homeAccountId,
            };
            onLoginSuccess(user);
            navigate("/chatbot"); // Navigate after login
          }
        } catch (error) {
          console.error("Error processing redirect response:", error);
          setError("Microsoft Sign-In failed. Please try again.");
        }
      };

      handleRedirectResponse(); // Handle redirect response after login
    }, [instance, navigate]);

    return (
      <div>
        <button onClick={handleMicrosoftLogin} className="microsoft-login-button">
          Sign in with Microsoft
        </button>

        {/* Display list of Microsoft accounts if available */}
        {microsoftAccounts.length > 0 && (
          <div className="account-list">
            <h3>Select a Microsoft Account</h3>
            {microsoftAccounts.map((account) => (
              <div key={account.homeAccountId} className="account-item">
                <div className="account-details">
                  {account.idToken && account.idToken.picture ? (
                    <img
                      src={account.idToken.picture}
                      alt={account.name}
                      className="account-profile-pic"
                    />
                  ) : (
                    <div className="account-placeholder-pic">A</div>
                  )}
                  <div>
                    <p className="account-name">{account.name}</p>
                    <p className="account-email">{account.username}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    onLoginSuccess({
                      email: account.username,
                      name: account.name,
                      microsoftId: account.homeAccountId,
                    });
                    navigate("/chatbot");
                  }}
                  className="account-select-button"
                >
                  Select
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <MsalProvider instance={msalInstance}>
      <GoogleOAuthProvider clientId={CLIENT_ID}>
        <div className="signin-container">
          <div className="signin-box">
            <h2>Sign In</h2>
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label>Email</label>
                <input
                  type="email"
                  aria-label="Email address"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error.includes("email")) setError("");
                  }}
                  required
                />
              </div>
              <div className="input-group">
                <label>Password</label>
                <input
                  type="password"
                  aria-label="Password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error.includes("Password")) setError("");
                  }}
                  required
                />
              </div>
              {error && <p className="error-message">{error}</p>}
              <button type="submit" className="signin-btn">
                Sign In
              </button>
            </form>

            <div className="google-login">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError("Google Sign-In failed. Please try again.")}
                useOneTap
                className="google-login-button"
              />
            </div>

            <div className="microsoft-login">
              <MicrosoftLoginButton />
            </div>

            <p className="signup-link">
              Don't have an account? <Link to="/signup">Sign up here</Link>
            </p>
          </div>
        </div>
      </GoogleOAuthProvider>
    </MsalProvider>
  );
};

export default SignIn;
