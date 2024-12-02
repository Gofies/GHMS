import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import "./App.css";
import LoginPage from "./pages/user/login/Login.js";
import PatientSignupPage from "./pages/patient/PatientSignupPage.tsx";
import AdminView from "./views/app/admin";
import DoctorView from "./views/app/doctor";
import PatientView from "./views/app/patient";
import LabStaffView from "./views/app/labStaff";
import ProtectedRoute from "./components/ProtectedRoute.js";
import { store, persistor } from "./redux/store";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
//import { DarkModeProvider } from '../src/helpers/DarkModeContext.js';

function App() {
  return (
   // <DarkModeProvider>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/signup" element={<PatientSignupPage />} />
            <Route element={<ProtectedRoute requiredRole="admin" />}>
              <Route path="/admin/*" element={<AdminView />} />
            </Route>
            <Route element={<ProtectedRoute requiredRole="doctor" />}>
              <Route path="/doctor/*" element={<DoctorView />} />
            </Route>
            <Route element={<ProtectedRoute requiredRole="lab-staff" />}>
              <Route path="/lab-staff/*" element={<LabStaffView />} />
            </Route>
            <Route element={<ProtectedRoute requiredRole="patient" />}>
              <Route path="/patient/:patientId/*" element={<PatientView />} />
            </Route>
          </Routes>
          <ToastContainer />
        </BrowserRouter>
      </PersistGate>
    </Provider>
   // </DarkModeProvider>
  );
}

export default App;
