import LabTechnician from "../../models/lab.technician.model.js";
import bcryptjs from 'bcryptjs';

const newLabTechnician = async (req, res) => {
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
            specialization,
            certificates,
            hospital
        } = req.body;

        const isExist = await LabTechnician.findOne({ email });

        if (isExist) {
            return res.status(400).json({ message: 'Lab Technician already exists' });
        }

        const hashedPassword = await bcryptjs.hash(password, 10);

        const labTechnician = new LabTechnician({
            name,
            surname,
            title,
            email,
            password: hashedPassword,
            birthdate,
            phone,
            jobstartdate,
            specialization,
            certificates,
            hospital,
            role: "labtechnician"
        });

        await labTechnician.save();

        res.status(201).json({ message: "Lab Technician created successfully", labTechnician });

    } catch (error) {
        console.log(error, "Error in newLabTechnician");
        res.status(500).json({ message: "Internal server error" });
    }
}

const getLabTechnician = async (req, res) => {
    try {
        const labTechnician = await LabTechnician.findById(req.params.id).populate('hospital', 'name').select('-password');
        return res.status(200).json({ message: 'Lab Technician retrieved successfully', labTechnician });
    } catch (error) {
        return res.status(500).json({ message: "admin.getLabTechnician :" + error.message });
    }
}

const getAllLabTechnicians = async (req, res) => {
    try {
        const labTechnicians = await LabTechnician.find().populate('hospital', 'name').select('-password');
        return res.status(200).json({ message: 'Lab Technicians retrieved successfully', labTechnicians });
    } catch (error) {
        return res.status(500).json({ message: "admin.getAllLabTechnicians :" + error.message });
    }
}

const updateLabTechnician = async (req, res) => {
    try {
        const labTechnician = await LabTechnician.findByIdAndUpdate
            (req.params.id, req.body, { new: true });

        return res.status(200).json({ message: 'Lab Technician updated successfully', labTechnician });
    }
    catch (error) {
        return res.status(500).json({ message: "admin.updateLabTechnician :" + error.message });
    }
}

const deleteLabTechnician = async (req, res) => {
    try {
        await LabTechnician.findByIdAndDelete(req.params.id);
        return res.status(200).json({ message: 'Lab Technician deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: "admin.deleteLabTechnician :" + error.message });
    }
}

export { newLabTechnician, getLabTechnician, getAllLabTechnicians, updateLabTechnician, deleteLabTechnician };