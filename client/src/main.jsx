import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { StudentContextProvider } from "./context/studentContext";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <StudentContextProvider>
      <App />
      <ToastContainer />
    </StudentContextProvider>
  </BrowserRouter>
);
