import React, { Component } from "react";
import { createRoot } from "react-dom/client";
import HomePage from "./HomePage";

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const bodyStyle = {
      margin: 0,
      padding: 0,
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      backgroundColor: "#f0f2f5",
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    };

    const centerStyle = {
      textAlign: "center",
      padding: "2rem",
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      width: "90%",
      maxWidth: "600px",
    };

    return (
      <div style={bodyStyle}>
        <div style={centerStyle}>
          <HomePage />
        </div>
      </div>
    );
  }
}

// This JS runs after the HTML is loaded in backend, so the DOM element <div id="app"></div> is available.
const appDiv = document.getElementById("app");
const root = createRoot(appDiv);
root.render(<App />);
