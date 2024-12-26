import LabTechnician from "../../models/lab.technician.model.js";
import bcryptjs from 'bcryptjs';

const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        const labTechnician = await LabTechnician.findById(req.user.id);

        if (!labTechnician) {
            return res.status(404).json({ message: "Lab technician not found" });
        }

        const isMatch = await bcryptjs.compare(oldPassword, labTechnician.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const hashedPassword = await bcryptjs.hash(newPassword, 12);

        labTechnician.password = hashedPassword;

        await labTechnician.save();

        return res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
        console.error(error, 'Error in changePassword controller');
        res.status(500).send('Server Error');
    }
};

export { changePassword };