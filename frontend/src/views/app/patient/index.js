import React from 'react';
import { Routes, Route } from "react-router-dom";
import PatientHomePage from "../../../pages/patient/PatientHomePage.tsx";

const PatientView = () => {
  return (
    <Routes>
      <Route path="/" element={<PatientHomePage />} />
      {/* Add additional routes here for PatientView */}
      {/* Example: <Route path="/settings" element={<PatientSettings />} /> */}
   </Routes>
  );
}

export default PatientView;