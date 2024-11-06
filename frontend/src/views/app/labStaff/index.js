import React from 'react';
import { Routes, Route } from "react-router-dom";
import LabStaffHomePage from "../../../pages/labStaff/LabStaffHomePage.tsx";

const LabStaffView = () => {
  return (
    <Routes>
      <Route path="/" element={<LabStaffHomePage />} />
      {/* Add additional routes here for LabStaffView */}
      {/* Example: <Route path="/settings" element={<LabStaffSettings />} /> */}
   </Routes>
  );
}

export default LabStaffView;
