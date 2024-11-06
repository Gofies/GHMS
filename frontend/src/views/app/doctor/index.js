import React from 'react';
import { Routes, Route } from "react-router-dom";
import DoctorHomePage from "../../../pages/doctor/DoctorHomePage.tsx"

const DoctorView = () => {
  return (
    <Routes>
      <Route path="/" element={<DoctorHomePage />} />
      {/* Add additional routes here for DoctorView */}
      {/* Example: <Route path="/settings" element={<DoctorSettings />} /> */}
    </Routes>
  );
}

export default DoctorView;
