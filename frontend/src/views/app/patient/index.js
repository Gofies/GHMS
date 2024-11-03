import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';

function PatientHomePage() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<PatientHomePage />}></Route> */}
        {/* related links will be added here */}
      </Routes>
    </BrowserRouter>
  );
}

export default PatientHomePage;