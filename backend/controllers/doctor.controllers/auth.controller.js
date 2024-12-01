import Doctor from "../../models/doctor.model.js";
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

        const doctor = await Doctor.findById(req.user._id);

        if (!doctor) {
            return res.status(404).json({ message: 'doctor not found' });
        }

        const isMatch = await bcryptjs.compare(currentPassword, doctor.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid current password' });
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(newPassword, salt);

        doctor.password = hashedPassword;
        await doctor.save();

        return res.status(200).json({ message: 'Password updated successfully' });

    } catch (error) {
        console.log('Error in changePassword controller: ', error.message);
        return res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};


export { changePassword };