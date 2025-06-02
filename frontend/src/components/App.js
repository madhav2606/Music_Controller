import React, { Component } from "react";
import { createRoot } from "react-dom/client";
import HomePage from "./HomePage";

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="center">
        <HomePage/>
      </div>
    )
    
  }
}


// This JS runs after the HTML is loaded in backend, so the DOM element <div id="app"></div> is available.
const appDiv = document.getElementById("app");
const root = createRoot(appDiv);
root.render(<App />);
