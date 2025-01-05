import React from 'react';
import { Routes, Route } from "react-router-dom";
import AdminUserManagement from "../../../pages/admin/AdminUserManagementPage.tsx"
import AdminPolyclinicManagement from "../../../pages/admin/AdminPolyclinicManagementPage.tsx"
import AdminHospitalManagement from "../../../pages/admin/AdminHospitalManagementPage.tsx"
import AdminSettingsPage from "../../../pages/admin/AdminSettingsPage.tsx"

const AdminView = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminUserManagement />} />
      <Route path="/user-management/*" element={<AdminUserManagement />} />
      <Route path="/polyclinic-management/*" element={<AdminPolyclinicManagement />} />
      <Route path="/hospital-management/*" element={<AdminHospitalManagement />} />
      <Route path="/system-settings/*" element={<AdminSettingsPage />} />
    </Routes>
  );
}

export default AdminView;