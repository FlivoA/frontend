import React from "react";
import ReactDOM from "react-dom";
import App from "./App"; // Your main application component
import { BrowserRouter as Router } from "react-router-dom"; // Ensure it's here

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);
