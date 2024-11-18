import bcrypt from 'bcrypt';
import Patient from '../../models/patient.model.js';
import generateJwt from '../../utils/generateJwt.js';

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
                    role: patient.role,
                }
            });
        }

    } catch (error) {
        console.log('Error in signup controller: ', error.message);
        return res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};


export { signup };