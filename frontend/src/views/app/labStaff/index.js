import React from 'react';
import { Routes, Route } from "react-router-dom";
import LabStaffHomePage from "../../../pages/labStaff/LabStaffHomePage.tsx";
import LabStaffResultsPage from "../../../pages/labStaff/LabStaffResultsPage.tsx";

const LabStaffView = () => {
  return (
    <Routes>
      <Route path="/" element={<LabStaffHomePage />} />
      <Route path="/results" element={<LabStaffResultsPage />} />
      {/* Add additional routes here for LabStaffView */}
      {/* Example: <Route path="/settings" element={<LabStaffSettings />} /> */}
   </Routes>
  );
}

export default LabStaffView;
