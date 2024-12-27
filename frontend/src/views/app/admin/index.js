import React from 'react';
import { Routes, Route } from "react-router-dom";
import AdminHomePage from "../../../pages/admin/AdminHomePage.tsx"
import AdminUserManagement from "../../../pages/admin/AdminUserManagementPage.tsx"
import AdminPolyclinicManagement from "../../../pages/admin/AdminPolyclinicManagementPage.tsx"
import AdminHospitalManagement from "../../../pages/admin/AdminHospitalManagementPage.tsx"

// import AdminSecurityPage from "../../../pages/admin/AdminSecurityPage.tsx"
import AdminSettingsPage from "../../../pages/admin/AdminSettingsPage.tsx"


const AdminView = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminUserManagement />} />
      <Route path="/user-management/*" element={<AdminUserManagement />} />
      <Route path="/polyclinic-management/*" element={<AdminPolyclinicManagement />} />
      <Route path="/hospital-management/*" element={<AdminHospitalManagement />} />
      {/* <Route path="/security/*" element={<AdminSecurityPage />} /> */}
      <Route path="/system-settings/*" element={<AdminSettingsPage />} />

      {/* Add additional routes here for DoctorView */}
      {/* Example: <Route path="/settings" element={<AdminSettings />} /> */}
   </Routes>
  );
}

export default AdminView;
