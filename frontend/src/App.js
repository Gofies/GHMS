import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import LoginPage from './pages/user/login/login.tsx';
import ForgotPasswordPage from './pages/user/forgotPassword/forgotPassword.tsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />}></Route>
        <Route path="/forgot-password" element={<ForgotPasswordPage />}></Route>
        {/* related links will be added here such as "/error", "/unauthorized" ... */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;