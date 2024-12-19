import React, { useState } from "react";
import "./App.css";
import imjjLogo from "./assets/imjj.png";

function App() {
  const [mode, setMode] = useState("General mode");
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  // Function to handle mode changes
  const handleModeChange = (newMode) => {
    setMode(newMode);
    setChatHistory([]); // Clear chat history when mode changes
  };

  // Function to handle input field changes
  const handleQuestionChange = (event) => {
    setQuestion(event.target.value);
  };

  // Function to handle sending questions
  const handleSend = async () => {
    if (question.trim()) {
      const newEntry = { question, response: "Flivo is thinking..." };
      setChatHistory((prev) => [...prev, newEntry]);
      setQuestion(""); // Clear the input field
      setLoading(true);

      try {
        // Construct the query string
        const queryParam = encodeURIComponent(question);
        const url = `https://a3zxqiquq5fte2hz7gd56mfewe0jgfkv.lambda-url.us-east-1.on.aws/?query=${queryParam}`;

        // Send a GET request
        const res = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        // Change to handle text response instead of JSON
        const data = await res.text(); // Get the response as plain text
        console.log("Response data:", data); // Log the response data
        const responseText = data || "No response from the server.";

        // Update the latest entry with the AI's response
        setChatHistory((prev) => {
          const updatedHistory = [...prev];
          updatedHistory[updatedHistory.length - 1].response = responseText;
          return updatedHistory;
        });
      } catch (error) {
        console.error("Error connecting to Lambda:", error); // Log any error
        setChatHistory((prev) => {
          const updatedHistory = [...prev];
          updatedHistory[updatedHistory.length - 1].response =
            "An error occurred while connecting to the server.";
          return updatedHistory;
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="app">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo-container">
          <img src={imjjLogo} alt="IMJJ Logo" className="logo" />
          <p className="logo-text">ASK</p>
        </div>
        <nav>
          <ul>
            <li onClick={() => handleModeChange("Modes")}>Modes</li>
            <li onClick={() => handleModeChange("General mode")}>
              General mode
            </li>
            <li onClick={() => handleModeChange("Document mode")}>
              Document mode
            </li>
            <li onClick={() => handleModeChange("Knowledge Graph mode")}>
              Knowledge Graph mode
            </li>
          </ul>
        </nav>
        <div className="footer">
          <button className="switch-button">Switch to current version</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="content">
        <h2>Talk to FlivoAI</h2>

        {/* Chat History */}
        <div className="chat-history">
          {chatHistory.map((chat, index) => (
            <div key={index} className="chat-entry">
              <p className="question">
                <strong>You:</strong> {chat.question}
              </p>
              <div className="response">
                <strong>FlivoAI:</strong>
                {chat.response}
              </div>
            </div>
          ))}
        </div>

        {/* Chatbox */}
        <div className="chatbox">
          <input
            type="text"
            placeholder="Ask something here..."
            value={question}
            onChange={handleQuestionChange}
            disabled={loading}
          />
          <button
            className="send-button"
            onClick={handleSend}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </div>
      </main>
    </div>
  );
}

export default App;
