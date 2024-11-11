import express from "express";
import cors from "cors";

import dotenv from "dotenv";
import connectDB from "./config/db.js";
import patientAuthRoutes from "./routes/patient.routes/auth.route.js";
//import { serveSwagger, setupSwagger } from "./utils/swagger.js";

dotenv.config();
const PORT = 5000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//app.use(cookieParser());
//app.use('/api-docs', serveSwagger, setupSwagger);

app.use("/api/v1/patient/auth", patientAuthRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    connectDB();
});

