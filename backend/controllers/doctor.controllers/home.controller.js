import Doctor from "../../models/doctor.model.js";

const getDoctorHome = async (req, res) => {
    try {
        // Fetch the doctor's appointments and populate their related tests
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

        // Filter today's appointments
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));
        const todaysAppointments = doctor.appointments.filter(appointment =>
            new Date(appointment.date) >= startOfDay && new Date(appointment.date) <= endOfDay
        );

        // Filter recent appointments with lab tests
        const recentAppointments = doctor.appointments.filter(appointment =>
            new Date(appointment.date) < startOfDay
        );

        const recentLabTests = recentAppointments
            .filter(appointment => appointment.type === 'lab')
            .flatMap(appointment => appointment.tests);

        // Extract only the required fields from the tests
        const filteredLabTests = recentLabTests.map(({ patient, testtype, resultdate, status }) => ({
            patient,
            testtype,
            resultdate,
            status
        }));

        res.json({ todaysAppointments, filteredLabTests });

    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

export { getDoctorHome };
