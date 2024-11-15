import React from 'react';
import { Routes, Route } from "react-router-dom";
import PatientHomePage from "../../../pages/patient/PatientHomePage.tsx";
import PatientHealthMetricsPage from "../../../pages/patient/PatientHealthMetricsPage.tsx";
import PatientAppointmentsPage from "../../../pages/patient/PatientAppointmentsPage.tsx";
import PatientProfilePage from "../../../pages/patient/PatientProfilePage.tsx";
const PatientView = () => {
  return (
    <Routes>
      <Route path="/" element={<PatientHomePage />} />
      <Route path="/health-metrics" element={<PatientHealthMetricsPage />} />
      <Route path="/appointments" element={<PatientAppointmentsPage />} />
      <Route path="/profile" element={<PatientProfilePage />} />
      {/* Add additional routes here for PatientView */}
      {/* Example: <Route path="/settings" element={<PatientSettings />} /> */}
   </Routes>
  );
}

export default PatientView;