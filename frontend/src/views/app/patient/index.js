import React from 'react';
import { Routes, Route } from "react-router-dom";
import PatientHomePage from "../../../pages/patient/PatientHomePage.tsx";
import PatientHealthMetricsPage from "../../../pages/patient/PatientHealthMetricsPage.tsx";


const PatientView = () => {
  return (
    <Routes>
      <Route path="/" element={<PatientHomePage />} />
      <Route path="/health-metrics" element={<PatientHealthMetricsPage />} />

      {/* Add additional routes here for PatientView */}
      {/* Example: <Route path="/settings" element={<PatientSettings />} /> */}
   </Routes>
  );
}

export default PatientView;