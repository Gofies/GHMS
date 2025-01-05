import React from 'react';
import { Routes, Route } from "react-router-dom";
import DoctorHomePage from "../../../pages/doctor/DoctorHomePage.tsx"
import DoctorPatientManagementPage from "../../../pages/doctor/DoctorPatientManagementPage.tsx"
import DoctorPatientDetailsPage from "../../../pages/doctor/DoctorPatientDetailsPage.tsx"
import DoctorSettingsPage from "../../../pages/doctor/DoctorSettingsPage.tsx"

const DoctorView = () => {
  return (
    <Routes>
      <Route path="/" element={<DoctorHomePage />} />
      <Route path="/patient-management/*" element={<DoctorPatientManagementPage />} />
      <Route path="/patient-details/:patientId" element={<DoctorPatientDetailsPage />} />
      <Route path="/settings" element={<DoctorSettingsPage />} />
    </Routes>
  );
}

export default DoctorView;
