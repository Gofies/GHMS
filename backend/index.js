import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { setupMetrics, trackRequests } from "./metrics.js";

import dotenv from "dotenv";
import { connectToMongoDB } from "./config/db.js";
import './updateDoctorSchedules.js';

import authRoutes from "./routes/auth.route.js";

import patientAuthRoutes from "./routes/patient.routes/auth.route.js";
import patientAppointmentRoutes from "./routes/patient.routes/appointment.route.js";
import patientMetricsRoutes from "./routes/patient.routes/health.metric.route.js";
import patientMedicalRecordRoutes from "./routes/patient.routes/medical.record.route.js";
import patientProfileRoutes from "./routes/patient.routes/profile.route.js";
import patientHomeRoutes from "./routes/patient.routes/home.route.js";

import adminDoctorRoutes from "./routes/admin.routes/doctor.routes.js";
import adminPatientRoutes from "./routes/admin.routes/patient.routes.js";
import adminHospitalRoutes from "./routes/admin.routes/hospital.routes.js";
import adminPolyclinicRoutes from "./routes/admin.routes/polyclinic.routes.js";
import adminLabTechRoutes from "./routes/admin.routes/labtechnician.routes.js";

import doctorHomeRoutes from "./routes/doctor.routes/home.route.js";
import doctorPatientRoutes from "./routes/doctor.routes/patient.route.js";
import doctorAuthRoutes from "./routes/doctor.routes/auth.route.js";

import labTechnicianHomeRoutes from "./routes/lab.routes/home.route.js";
import labTechnicianAuthRoutes from "./routes/lab.routes/auth.route.js";
import labTechnicianTestRoutes from "./routes/lab.routes/test.route.js";

import {setupSwagger } from "./swager.js";

dotenv.config();
const PORT = 5000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(trackRequests);
setupMetrics(app);

//app.use('/api-docs', serveSwagger, setupSwagger);

app.use("/api/v1/auth", authRoutes);

app.use("/api/v1/patient/", patientHomeRoutes);
app.use("/api/v1/patient/auth", patientAuthRoutes);
app.use("/api/v1/patient/appointments", patientAppointmentRoutes);
app.use("/api/v1/patient/metrics", patientMetricsRoutes);
app.use("/api/v1/patient/medical-record", patientMedicalRecordRoutes);
app.use("/api/v1/patient/profile", patientProfileRoutes);

app.use("/api/v1/admin/doctor", adminDoctorRoutes);
app.use("/api/v1/admin/patient", adminPatientRoutes);
app.use("/api/v1/admin/hospital", adminHospitalRoutes);
app.use("/api/v1/admin/polyclinic", adminPolyclinicRoutes);
app.use("/api/v1/admin/labtechnician", adminLabTechRoutes);

app.use("/api/v1/doctor/", doctorHomeRoutes);
app.use("/api/v1/doctor/patient", doctorPatientRoutes);
app.use("/api/v1/doctor/auth", doctorAuthRoutes);

app.use("/api/v1/labtechnician", labTechnicianHomeRoutes);
app.use("/api/v1/labtechnician/auth", labTechnicianAuthRoutes);
app.use("/api/v1/labtechnician/test", labTechnicianTestRoutes);
setupSwagger(app);

//ASAGDAKI SILMEEEEEEEEEEEEEEEEEE
app.get("/api/health", (req, res) => {
    res.status(200).send('OK');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    connectToMongoDB();
});

