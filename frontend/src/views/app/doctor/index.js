import React from 'react';
import { Routes, Route } from "react-router-dom";
import DoctorHomePage from "../../../pages/doctor/DoctorHomePage.tsx"
import DoctorPatientManagementPage from "../../../pages/doctor/DoctorPatientManagementPage.tsx"
import DoctorPatientDetailsPage from "../../../pages/doctor/DoctorPatientDetailsPage.tsx"

const DoctorView = () => {
  return (
    <Routes>
      <Route path="/" element={<DoctorHomePage />} />
      <Route path="/patient-management/*" element={<DoctorPatientManagementPage />} />
      <Route path="/patient-details/*" element={<DoctorPatientDetailsPage />} />
      {/* Add additional routes here for DoctorView */}
      {/* Example: <Route path="/settings" element={<DoctorSettings />} /> */}
    </Routes>
  );
}

export default DoctorView;
