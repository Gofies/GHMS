import jwt from 'jsonwebtoken';
import Patient from '../models/patient.model.js';
import Doctor from '../models/doctor.model.js';
import Labtechnician from '../models/lab.technician.model.js';
import Admin from '../models/admin.model.js';

export const protect = (requiredRole) => {
    return async (req, res, next) => {
        try {
            const token = req.cookies.accessToken;
            // Check if access token exists
            if (!token) {
                const refreshToken = req.cookies.refreshToken;

                if (!refreshToken) {
                    return res.status(401).json({ message: 'Unauthorized' });
                }

                try {
                    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

                    return res.status(403).json({ message: 'Forbidden' });
                } catch (err) {
                    return res.status(401).json({ message: 'Unauthorized' });
                }
            }

            // Verify access token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Find the user by their role and ID
            let user;
            if (requiredRole === 'patient') {
                user = await Patient.findById(decoded.id).select('-password');
            } else if (requiredRole === 'doctor') {
                user = await Doctor.findById(decoded.id).select('-password');
            } else if (requiredRole === 'labtechnician') {
                user = await Labtechnician.findById(decoded.id).select('-password');
            } else if (requiredRole === 'admin') {
                user = await Admin.findById(decoded.id).select('-password');
            }

            // If user is not found or roles don't match
            if (!user) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            if (requiredRole !== user.role) {
                return res.status(403).json({ message: 'Forbidden' });
            }

            // Attach user to the request object
            req.user = user;
            next();
        } catch (error) {
            console.error('Error in authorization middleware:', error.message);
            return res.status(500).json({ message: "auth.middleware: " + error.message });
        }
    };
};
