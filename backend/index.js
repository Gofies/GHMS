import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import dotenv from "dotenv";
import connectDB from "./config/db.js";

import authRoutes from "./routes/auth.route.js";

import patientAuthRoutes from "./routes/patient.routes/auth.route.js";
import patientAppointmentRoutes from "./routes/patient.routes/appointment.route.js";
import patientMetricsRoutes from "./routes/patient.routes/health.metric.route.js";
import patientMedicalRecordRoutes from "./routes/patient.routes/medical.record.route.js";
import patientProfileRoutes from "./routes/patient.routes/profile.route.js";
import patientHomeRoutes from "./routes/patient.routes/home.route.js";

import adminDoctorRoutes from "./routes/admin.routes/doctor.routes.js";

//import { serveSwagger, setupSwagger } from "./utils/swagger.js";

dotenv.config();
const PORT = 5000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
//app.use('/api-docs', serveSwagger, setupSwagger);

app.use("/api/v1/auth", authRoutes);

app.use("/api/v1/patient/", patientHomeRoutes);
app.use("/api/v1/patient/auth", patientAuthRoutes);
app.use("/api/v1/patient/appointments", patientAppointmentRoutes);
app.use("/api/v1/patient/metrics", patientMetricsRoutes);
app.use("/api/v1/patient/medical-record", patientMedicalRecordRoutes);
app.use("/api/v1/patient/profile", patientProfileRoutes);

app.use("/api/v1/admin/doctors", adminDoctorRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    connectDB();
});

