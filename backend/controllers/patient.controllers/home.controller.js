import Patient from '../../models/patient.model.js';

const getUpcomingAppointments = async (req, res) => {
    try {
        const patient = await Patient.findById(req.user._id)
            .select('appointments')
            .populate({ path: 'appointments', match: { status: 'Scheduled' } });

        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }

        const appointments = patient.appointments;

        if (appointments) {
            return res.status(200).json({
                message: 'Appointments retrieved successfully',
                appointments
            });
        }
    }
    catch (error) {
        return res.status(500).json({ message: "patient.getUpcomingAppointments: " + error.message });
    }
}

const getRecentAppointments = async (req, res) => {
    try {
        const patient = await Patient.findById(req.user._id)
            .select('appointments')
            .populate({ path: 'appointments', match: { status: 'Completed' } });

        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }

        const appointments = patient.appointments;

        if (appointments) {
            return res.status(200).json({
                message: 'Appointments retrieved successfully',
                appointments
            });
        }
    }
    catch (error) {
        return res.status(500).json({ message: "patient.getRecentAppointments: " + error.message });
    }
}


export { getUpcomingAppointments, getRecentAppointments };