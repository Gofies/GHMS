import bcryptjs from 'bcryptjs';
import Patient from '../../models/patient.model.js';
import generateJwt from '../../utils/generateJwt.js';

const signup = async (req, res) => {
    try {
        const { name, surname, gender, email, password, passwordconfirm, phone, emergencycontact, birthdate, nationality, address } = req.body;

        if (
            name === undefined ||
            surname === undefined ||
            gender === undefined ||
            email === undefined ||
            password === undefined ||
            passwordconfirm === undefined ||
            phone === undefined ||
            emergencycontact === undefined ||
            birthdate === undefined ||
            nationality === undefined ||
            address === undefined
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

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const patient = await Patient.create({
            name,
            surname,
            gender,
            email,
            password: hashedPassword,
            phone,
            emergencycontact,
            birthdate,
            nationality,
            address,
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
                    emergencycontact: patient.emergencycontact,
                    birthdate: patient.birthdate,
                    address: patient.address,
                    role: patient.role,
                }
            });
        }

    } catch (error) {
        console.log('Error in signup controller: ', error.message);
        return res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword, newPasswordConfirm } = req.body;

        if (currentPassword === undefined || newPassword === undefined || newPasswordConfirm === undefined) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        if (newPassword !== newPasswordConfirm) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        const patient = await Patient.findById(req.user._id);

        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        const isMatch = await bcryptjs.compare(currentPassword, patient.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid current password' });
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(newPassword, salt);

        patient.password = hashedPassword;
        await patient.save();

        return res.status(200).json({ message: 'Password updated successfully' });

    } catch (error) {
        console.log('Error in changePassword controller: ', error.message);
        return res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};


export { signup, changePassword };