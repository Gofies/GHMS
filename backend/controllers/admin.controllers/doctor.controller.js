import Doctor from '../../models/doctor.model.js';
import bcryptjs from 'bcryptjs';

const getDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find({}, 'name surname title email specialization polyclinic hospital')
            .populate('hospital', 'name')
            .populate('polyclinic', 'name');
        
        return res.status(200).json({
            message: 'Doctors retrieved successfully',
            doctors
        });
    } catch (error) {
        return res.status(500).json({ message: "admin.getDoctors: " + error.message });
    }
};

const getDoctorsOfHospital = async (req, res) => {
    try {
        const doctors = await Doctor.find({ hospital: req.params.hospitalId }, 'name surname specialization polyclinic').populate('polyclinic', 'name');
        return res.status(200).json({ message: 'Doctors retrieved successfully', doctors });
    } catch (error) {
        return res.status(500).json({ message: "admin.getDoctorsOfHospital: " + error.message });
    }
}

const getDoctor = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id).populate('hospital', 'name').populate('polyclinic', 'name').select('-password');
        return res.status(200).json({ message: 'Doctor retrieved successfully', doctor });
    } catch (error) {
        return res.status(500).json({ message: "admin.getDoctor :" + error.message });
    }
}

const newDoctor = async (req, res) => {
    try {
        const {
            name,
            surname,
            title,
            email,
            password,
            birthdate,
            phone,
            jobstartdate,
            degree,
            specialization
        } = req.body;

        const isExist = await Doctor.findOne({ email });

        if (isExist) {
            return res.status(400).json({ message: 'Doctor already exists' });
        }

        const hashedPassword = await bcryptjs.hash(password, 10);

        const doctor = new Doctor({
            name,
            surname,
            title,
            email,
            password: hashedPassword,
            birthdate,
            phone,
            jobstartdate,
            degree,
            specialization,
            role: 'doctor'
        });

        await doctor.save();

        return res.status(201).json({ message: 'Doctor created successfully', doctor });
    } catch (error) {
        return res.status(500).json({ message: "admin.newDoctor :" + error.message });
    }
}

const updateDoctor = async (req, res) => {
    try {
        const doctor = await Doctor.findByIdAndUpdate
            (req.params.id, req.body, { new: true });

        return res.status(200).json({ message: 'Doctor updated successfully', doctor });
    }
    catch (error) {
        return res.status(500).json({ message: "admin.updateDoctor :" + error.message });
    }
}

const deleteDoctor = async (req, res) => {
    try {
        await Doctor.findByIdAndDelete(req.params.id);
        return res.status(200).json({ message: 'Doctor deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: "admin.deleteDoctor :" + error.message });
    }
}

export { getDoctors, getDoctorsOfHospital, getDoctor, newDoctor, updateDoctor, deleteDoctor };