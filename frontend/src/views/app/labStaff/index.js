import React from 'react';
import { Routes, Route } from "react-router-dom";
import LabStaffHomePage from "../../../pages/labStaff/LabStaffHomePage.tsx";
import LabStaffTestsPage from "../../../pages/labStaff/LabStaffTestsPage.tsx";
const LabStaffView = () => {
  return (
    <Routes>
      <Route path="/" element={<LabStaffHomePage />} />
      <Route path="/tests" element={<LabStaffTestsPage />} />
      {/* Add additional routes here for LabStaffView */}
      {/* Example: <Route path="/settings" element={<LabStaffSettings />} /> */}
   </Routes>
  );
}

export default LabStaffView;
