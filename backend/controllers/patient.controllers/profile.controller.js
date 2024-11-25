import Patient from '../../models/patient.model.js';

const getProfile = async (req, res) => {
    try {
        const patient = await Patient.findById(req.user._id).select('-password');
        return res.status(200).json({ message: 'Profile retrieved successfully', patient });
    } catch (error) {
        return res.status(500).json({ message: "patient.getProfile: " + error.message });
    }
}

const updateProfile = async (req, res) => {
    try {
        const patient = await Patient.findByIdAndUpdate(req.user._id, req.body, { new: true });
        return res.status(200).json({ message: 'Profile updated successfully', patient });

    } catch (error) {
        return res.status(500).json({ message: "patient.updateProfile: " + error.message });
    }
}

export { getProfile, updateProfile };