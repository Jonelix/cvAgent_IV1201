/**
 * Entry point of the React application.
 * 
 * - Wraps the `App` component inside `HashRouter` to enable client-side routing.
 * - Uses `React.StrictMode` to highlight potential problems during development.
 * - Renders the application into the root DOM element.
 */
import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import './index.css'
import App from './App.jsx'


console.log("running app");

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
      <HashRouter>
          <App />
      </HashRouter>
  </React.StrictMode>
);
