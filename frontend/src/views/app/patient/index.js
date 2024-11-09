import React from 'react';
import { Routes, Route } from "react-router-dom";
import PatientHomePage from "../../../pages/patient/PatientHomePage.tsx";
import PatientAppointmentsPage from "../../../pages/patient/PatientAppointmentsPage.tsx";

const PatientView = () => {
  return (
    <Routes>
      <Route path="/" element={<PatientHomePage />} />
      <Route path="/appointments" element={<PatientAppointmentsPage />} />

      {/* Add additional routes here for PatientView */}
      {/* Example: <Route path="/settings" element={<PatientSettings />} /> */}
   </Routes>
  );
}

export default PatientView;