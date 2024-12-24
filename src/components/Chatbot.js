import React, { useState, useRef } from "react";
import "./Chatbot.css"; // Import the CSS file
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import imjjLogo from "../assets/imjj.png";

function Chatbot({ onLogout }) {
  const [mode, setMode] = useState("General mode");
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null); // To manage the input focus

  // Handle mode change
  const handleModeChange = (newMode) => {
    setMode(newMode);
    setChatHistory([]);
  };

  // Handle question input
  const handleQuestionChange = (event) => {
    setQuestion(event.target.value);
  };

  // Handle sending question
  const handleSend = async () => {
    if (question.trim()) {
      const newEntry = { question, response: "Flivo is thinking..." };
      setChatHistory((prev) => [...prev, newEntry]);
      setQuestion("");
      setLoading(true);

      try {
        const queryParam = encodeURIComponent(question);
        const url = `https://a3zxqiquq5fte2hz7gd56mfewe0jgfkv.lambda-url.us-east-1.on.aws/?query=${queryParam}`;
        const res = await fetch(url);
        const data = await res.text();
        setChatHistory((prev) => {
          const updatedHistory = [...prev];
          updatedHistory[updatedHistory.length - 1].response = data || "No response from the server.";
          return updatedHistory;
        });
      } catch (error) {
        console.error("Error connecting to Lambda:", error);
        setChatHistory((prev) => {
          const updatedHistory = [...prev];
          updatedHistory[updatedHistory.length - 1].response = "An error occurred while connecting to the server.";
          return updatedHistory;
        });
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle "Enter" key press
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSend();
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
            <li onClick={() => handleModeChange("General mode")}>General mode</li>
            <li onClick={() => handleModeChange("Document mode")}>Document mode</li>
            <li onClick={() => handleModeChange("Knowledge Graph mode")}>Knowledge Graph mode</li>
          </ul>
        </nav>
        <div className="footer">
          <button className="switch-button" onClick={onLogout}>Logout</button>
        </div>
      </aside>

      {/* Chatbox Section */}
      <main className="content">
        <h2>Ask Flivo</h2>
        <div className="chat-history">
          {chatHistory.map((chat, index) => (
            <div key={index} className="chat-entry">
              <p className="question">
                <strong>You:</strong> {chat.question}
              </p>
              <p className="response">
                <strong>FlivoAI:</strong> {chat.response}
              </p>
            </div>
          ))}
        </div>
        <div className="chatbox-section">
          <div className="chatbox">
            <input
              ref={inputRef}
              type="text"
              placeholder="Ask something here..."
              value={question}
              onChange={handleQuestionChange}
              onKeyDown={handleKeyPress}
              disabled={loading}
            />
            <button
              className="send-button"
              onClick={handleSend}
              disabled={loading}
            >
              {loading ? "Sending..." : <FontAwesomeIcon icon={faPaperPlane} />}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Chatbot;
