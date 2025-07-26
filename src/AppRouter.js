// src/AppRouter.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import App from "./App";
import Login from "./components/Login";
import Register from "./components/Register";

const AppRouter = () => {
  const token = localStorage.getItem("token");

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            token ? <App /> : <Navigate to="/login" replace />
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRouter;
