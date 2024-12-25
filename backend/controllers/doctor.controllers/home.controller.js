import Doctor from "../../models/doctor.model.js";

const getDoctorHome = async (req, res) => {
    try {
        // Fetch the doctor's appointments and populate their related tests
        console.log(req.user.id);
        const doctor = await Doctor.findById(req.user.id)
            .select('appointments')
            .populate({
                path: 'appointments',
                populate: {
                    path: 'tests', // Populate tests within appointments
                    model: 'LabTest'
                }
            });

        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        const todaysAppointments = doctor.appointments.filter(appointment => {
            const today = new Date();
            return appointment.date.getDate() === today.getDate() &&
                appointment.date.getMonth() === today.getMonth() &&
                appointment.date.getFullYear() === today.getFullYear();
        });

        const recentLabResults = doctor.appointments.map(appointment => {
            return appointment.tests.filter(test => test.status === 'completed');
        });

        return res.status(200).json({
            message: 'Doctor home data retrieved successfully',
            todaysAppointments,
            recentLabResults
        });
    } catch (error) {
        console.error(error, 'Error in getDoctorHome controller');
        res.status(500).send('Server Error');
    }
};

export { getDoctorHome };
