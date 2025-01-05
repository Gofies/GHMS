import Admin from "../../models/admin.model.js";
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

        const admin = await Admin.findById(req.user._id);

        if (!admin) {
            return res.status(404).json({ message: 'admin not found' });
        }

        const isMatch = await bcryptjs.compare(currentPassword, admin.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid current password' });
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(newPassword, salt);

        admin.password = hashedPassword;
        await admin.save();

        return res.status(200).json({ message: 'Password updated successfully' });

    } catch (error) {
        console.log('Error in changePassword controller: ', error.message);
        return res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};


export { changePassword };