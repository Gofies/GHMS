import Patient from '../../models/patient.model.js';

const getHealthMetric = async (req, res) => {
    try {
        const metricsDoc = await Patient.findById(req.user._id).select('-_id weight height bloodpressure heartrate bloodsugar bloodtype');
        const allergies = await Patient.findById(req.user._id).select('-_id allergies');
        const metrics = metricsDoc.toObject();
        const bmi = (metrics.weight / ((metrics.height / 100) ** 2)).toFixed(2);
        metrics.bmi = bmi;
        return res.status(200).json({ message: 'Health metrics retrieved successfully', metrics, allergies });
    } catch (error) {
        return res.status(500).json({ message: "patient.getHealthMetric: " + error.message });
    }
}

const updateWeight = async (req, res) => {
    try {
        const patient = await Patient.findByIdAndUpdate(req.user._id, { weight: req.body.weight }, { new: true });
        return res.status(200).json({ message: 'Weight updated successfully', patient });
    }
    catch (error) {
        return res.status(500).json({ message: "patient.updateWeight: " + error.message });
    }
}

const updateHeight = async (req, res) => {
    try {
        const patient = await Patient.findByIdAndUpdate(req.user._id, { height: req.body.height }, { new: true });
        return res.status(200).json({ message: 'Height updated successfully', patient });
    }
    catch (error) {
        return res.status(500).json({ message: "patient.updateHeight: " + error.message });
    }
}

const updateBloodPressure = async (req, res) => {
    try {
        const patient = await Patient.findByIdAndUpdate(req.user._id, { bloodpressure: req.body["blood-pressure"] }, { new: true });
        return res.status(200).json({ message: 'Blood pressure updated successfully', patient });
    }
    catch (error) {
        return res.status(500).json({ message: "patient.updateBloodPressure: " + error.message });
    }
}

const updateBloodSugar = async (req, res) => {
    try {
        const patient = await Patient.findByIdAndUpdate(req.user._id, { bloodsugar: req.body["blood-sugar"] }, { new: true });
        return res.status(200).json({ message: 'Blood sugar updated successfully', patient });
    }
    catch (error) {
        return res.status(500).json({ message: "patient.updateBloodSugar: " + error.message });
    }
}

const updateBloodType = async (req, res) => {
    try {
        const patient = await Patient.findByIdAndUpdate(req.user._id, { bloodtype: req.body["blood-type"] }, { new: true });
        return res.status(200).json({ message: 'Blood type updated successfully', patient });
    }
    catch (error) {
        return res.status(500).json({ message: "patient.updateBloodType: " + error.message });
    }
}

const updateAllergies = async (req, res) => {
    try {
        const patient = await Patient.findByIdAndUpdate(
            req.user._id,
            { $push: { allergies: req.body.allergies } },
            { new: true }
        );

        return res.status(200).json({ message: 'Allergies updated successfully', patient });
    }
    catch (error) {
        return res.status(500).json({ message: "patient.updateAllergies: " + error.message });
    }
}

const deleteAllergy = async (req, res) => {
    try {
        const allergyName = req.body.allergyName;

        const patient = await Patient.findByIdAndUpdate(
            req.user._id,
            { $pull: { allergies: allergyName } },
            { new: true }
        );

        return res.status(200).json({ message: 'Allergy deleted successfully' });
    }
    catch (error) {
        return res.status(500).json({ message: "patient.deleteAllergy: " + error.message });
    }
}

const updateHeartRate = async (req, res) => {
    try {
        const patient = await Patient.findByIdAndUpdate(req.user._id, { heartrate: req.body["heart-rate"] }, { new: true });
        return res.status(200).json({ message: 'Heart rate updated successfully', patient });
    }
    catch (error) {
        return res.status(500).json({ message: "patient.updateHeartRate: " + error.message });
    }
}

export { getHealthMetric, updateWeight, updateHeight, updateHeartRate, updateBloodPressure, updateBloodSugar, updateBloodType, updateAllergies, deleteAllergy };
















