import Patient from '../../models/patient.model.js';

const getPatientHome = async (req, res) => {
    try {
        const patient = await Patient.findById(req.user.id).select('appointments').populate('appointments');
        const upcomingAppointments = patient.appointments.filter(appointment => appointment.date > new Date());
        const recentAppointments = patient.appointments.filter(appointment => appointment.date < new Date());
        res.json({ upcomingAppointments, recentAppointments });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
}

export { getPatientHome };