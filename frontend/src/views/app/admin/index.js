import React from 'react';
import { Routes, Route } from "react-router-dom";
import AdminHomePage from "../../../pages/admin/AdminHomePage.tsx"

const AdminView = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminHomePage />} />
      {/* Add additional routes here for DoctorView */}
      {/* Example: <Route path="/settings" element={<AdminSettings />} /> */}
   </Routes>
  );
}

export default AdminView;
