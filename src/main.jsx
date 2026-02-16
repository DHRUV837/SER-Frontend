import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { SalesProvider } from "./context/SalesContext";
import { NotificationProvider } from "./context/NotificationContext";
import { ThemeProvider } from "./context/ThemeContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <ThemeProvider>
        <SalesProvider>
          <NotificationProvider>
            <App />
          </NotificationProvider>
        </SalesProvider>
      </ThemeProvider>
    </AuthProvider>
  </BrowserRouter>
);
