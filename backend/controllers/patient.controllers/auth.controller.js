import bcrypt from 'bcrypt';
import Patient from '../../models/patient.model.js';
import generateJwt from '../../utils/generateJwt.js';
import jwt from 'jsonwebtoken';

const signup = async (req, res) => {
    try {
        const { name, surname, gender, email, password, passwordconfirm, phone, birthdate, nationality } = req.body;

        if (
            name === undefined ||
            surname === undefined ||
            gender === undefined ||
            email === undefined ||
            password === undefined ||
            passwordconfirm === undefined ||
            phone === undefined ||
            birthdate === undefined ||
            nationality === undefined
        ) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        if (password !== passwordconfirm) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        const patientExists = await Patient.findOne({ $or: [{ email }] });

        if (patientExists) {
            return res.status(400).json({ message: 'Patient already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const patient = await Patient.create({
            name,
            surname,
            gender,
            email,
            password: hashedPassword,
            phone,
            birthdate,
            nationality,
            role: 'patient'
        });

        if (patient) {
            generateJwt(patient._id, res);
            return res.status(201).json({
                message: 'Signup successful',
                patient: {
                    _id: patient._id,
                    name: patient.name,
                    surname: patient.surname,
                    gender: patient.gender,
                    email: patient.email,
                    phone: patient.phone,
                    birthdate: patient.birthdate,
                }
            });
        }

    } catch (error) {
        console.log('Error in signup controller: ', error.message);
        return res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (email === undefined || password === undefined) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const patient = await Patient.findOne({ email });

        if (!patient) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const validPassword = await bcrypt.compare(password, patient.password);

        if (!validPassword) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        generateJwt(patient._id, res);
        return res.status(200).json({ message: 'Login successful', patient: patient });

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



export { signup, login, logout, refreshToken };