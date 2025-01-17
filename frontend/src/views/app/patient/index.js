import React from 'react';
import { Routes, Route } from "react-router-dom";
import PatientHomePage from "../../../pages/patient/PatientHomePage.tsx";
import PatientHealthMetricsPage from "../../../pages/patient/PatientHealthMetricsPage.tsx";
import PatientAppointmentsPage from "../../../pages/patient/PatientAppointmentsPage.tsx";
import PatientNewAppointmentsPage from "../../../pages/patient/PatientNewAppointmentsPage.tsx";
import PatientProfilePage from "../../../pages/patient/PatientProfilePage.js";
import PatientMedicalRecordsPage from "../../../pages/patient/PatientMedicalRecordsPage.tsx";
import PatientSettingsPage from "../../../pages/patient/PatientSettingsPage.tsx";

const PatientView = () => {
  return (
    <Routes>
      <Route path="/" element={<PatientHomePage />} />
      <Route path="/health-metrics" element={<PatientHealthMetricsPage />} />
      <Route path="/appointments" element={<PatientAppointmentsPage />} />
      <Route path="/appointments/new" element={<PatientNewAppointmentsPage />} />
      <Route path="/profile" element={<PatientProfilePage />} />
      <Route path="/medical-records" element={<PatientMedicalRecordsPage />} />
      <Route path="/settings" element={<PatientSettingsPage />} />
   </Routes>
  );
}

export default PatientView;