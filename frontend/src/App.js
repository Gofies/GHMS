import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import LoginPage from './pages/user/login/Login.tsx';
import AdminView from "./views/app/admin"
import DoctorView from './views/app/doctor';
import PatientView from './views/app/patient';
import LabStaffView from './views/app/labStaff/index.js';
import PatientSignupPage from "./pages/patient/PatientSignupPage.tsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<PatientSignupPage />} />
        <Route path="/admin/*" element={<AdminView />} />
        <Route path="/doctor/*" element={<DoctorView />} />
        <Route path="/lab-staff/*" element={<LabStaffView />} />
        <Route path="/patient/*" element={<PatientView />} />
        {/* Add more routes as needed */}
      </Routes>
  </BrowserRouter>
);
}

export default App;