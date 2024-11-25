import bcryptjs from 'bcryptjs';
import Patient from '../models/patient.model.js';
import Doctor from '../models/doctor.model.js';
import Admin from '../models/admin.model.js';
import LabTechnician from '../models/lab.technician.model.js';
import generateJwt from '../utils/generateJwt.js';
import jwt from 'jsonwebtoken';

const adminSignup = async (req, res) => {
    try {
        const { name, surname, email, password, role, phone } = req.body;

        if (email === undefined || password === undefined) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const admin = await Admin.findOne({ email });

        if (admin) {
            return res.status(400).json({ message: 'Admin already exists' });
        }

        const hashedPassword = await bcryptjs.hash(password, 12);

        const newAdmin = new Admin({
            name,
            surname,
            email,
            password: hashedPassword,
            role,
            phone
        });

        await newAdmin.save();

        return res.status(201).json({ message: 'Admin created successfully' });
    } catch (error) {
        console.log('Error in admin signup controller: ', error.message);
        return res.status(500).json({ message: 'Server error. Please try again later.' });
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (email === undefined || password === undefined) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const patient = await Patient.findOne({ email });
        const doctor = await Doctor.findOne({ email });
        const admin = await Admin.findOne({ email });
        const labTechnician = await LabTechnician.findOne({ email });

        console.log(admin);

        if (!patient && !doctor && !admin && !labTechnician) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        if (patient) {
            const validPassword = await bcryptjs.compare(password, patient.password);
            if (!validPassword) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }
            generateJwt(patient._id, res);
            return res.status(200).json({ message: 'Login successful', id: patient._id, role: patient.role });
        } else if (doctor) {
            const validPassword = await bcryptjs.compare(password, doctor.password);
            if (!validPassword) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }
            generateJwt(doctor._id, res);
            return res.status(200).json({ message: 'Login successful', id: doctor._id, role: doctor.role });
        } else if (admin) {
            //const validPassword = await bcryptjs.compare(password, admin.password);
            //if (!validPassword) {
            //    return res.status(400).json({ message: 'Invalid credentials' });
            //}
            generateJwt(admin._id, res);
            return res.status(200).json({ message: 'Login successful', id: admin._id, role: admin.role });
        } else if (labTechnician) {
            const validPassword = await bcryptjs.compare(password, labTechnician.password);
            if (!validPassword) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }
            generateJwt(labTechnician._id, res);
            return res.status(200).json({ message: 'Login successful', id: labTechnician._id, role: labTechnician.role });
        }

    } catch (error) {
        console.log('Error in login controller: ', error.message);
        return res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

const logout = (req, res) => {
    try {
        res.clearCookie('token');
        return res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        console.log('Error in logout controller: ', error.message);
        return res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.cookies;

        if (!refreshToken) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: 'Invalid refresh token' });
            }

            // Find user based on decoded user ID from the refresh token
            const patient = await Patient.findById(decoded.id).select('-password');

            if (!patient) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            // Generate new tokens and send them in response
            generateJwt(patient._id, res);
            return res.status(200).json({ message: 'Token refreshed' });
        });
    } catch (error) {
        console.log('Error in refresh token endpoint: ', error.message);
        return res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

export { login, logout, refreshToken, adminSignup };