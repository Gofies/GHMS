import LabTechnician from "../../models/lab.technician.model.js";
import bcryptjs from 'bcryptjs';

const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword, newPasswordConfirm } = req.body;

        if (currentPassword === undefined || newPassword === undefined || newPasswordConfirm === undefined) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        if (newPassword !== newPasswordConfirm) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        const labTechnician = await LabTechnician.findById(req.user._id);

        if (!labTechnician) {
            return res.status(404).json({ message: 'labTechnician not found' });
        }

        const isMatch = await bcryptjs.compare(currentPassword, labTechnician.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid current password' });
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(newPassword, salt);

        labTechnician.password = hashedPassword;
        await labTechnician.save();

        return res.status(200).json({ message: 'Password updated successfully' });

    } catch (error) {
        console.log('Error in changePassword controller: ', error.message);
        return res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

export { changePassword };