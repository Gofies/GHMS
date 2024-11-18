import jwt from 'jsonwebtoken';
import Patient from '../models/patient.model.js';
import Doctor from '../models/doctor.model.js';
import Labtechnician from '../models/labtechnician.model.js';
import Ittechnician from '../models/ittechnician.model.js';
import Admin from '../models/admin.model.js';

export const protect = async (req, res, requiredRole, next) => {
    try {
        const token = req.cookies.accessToken;
        if (!token) {
            const refreshToken = req.cookies.refreshToken;
            const decodedRefreshToken = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
            if (decodedRefreshToken) {
                return res.status(403).json({ message: 'Forbidden' });
            } else {
                return res.status(401).json({ message: 'Unauthorized' });
            }
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // If the token is verified, find the user by their ID
        if (requiredRole === 'patient') {
            const user = await Patient.findById(decoded.id).select('-password');
        } else if (requiredRole === 'doctor') {
            const user = await Doctor.findById(decoded.id).select('-password');
        } else if (requiredRole === 'labtechnician') {
            const user = await Labtechnician.findById(decoded.id).select('-password');
        } else if (requiredRole === 'ittechnician') {
            const user = await Ittechnician.findById(decoded.id).select('-password');
        } else if (requiredRole === 'admin') {
            const user = await Admin.findById(decoded.id).select('-password');
        }

        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        if (requiredRole !== user.role) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        // Attach the user object to the request so that it can be accessed in next middleware or routes
        req.user = user;
        next();

    } catch (error) {
        console.log('Error in authorization middleware: ', error.message);
        return res.status(500).json({ message: 'Server error' });
    }
};