import React from 'react';
import { Routes, Route } from "react-router-dom";
import LabStaffTestsPage from "../../../pages/labStaff/LabStaffTestsPage.tsx";
import LabStaffSettingsPage from "../../../pages/labStaff/LabStaffSettingsPage.tsx";

const LabStaffView = () => {
  return (
    <Routes>
      <Route path="/" element={<LabStaffTestsPage />} />
      <Route path="/tests" element={<LabStaffTestsPage />} />
      <Route path="/settings" element={<LabStaffSettingsPage />} />
   </Routes>
  );
}

export default LabStaffView;
