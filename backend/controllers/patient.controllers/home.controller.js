import Patient from '../../models/patient.model.js';

const getPatientHome = async (req, res) => {
    try {
        const patient = await Patient.findById(req.user.id)
            .select('appointments')
            .populate({
                path: 'appointments',
                populate: [
                    { path: 'doctor', select: 'name surname' },
                    { path: 'hospital', select: 'name' },
                    { path: 'polyclinic', select: 'name' }
                ]
            });

        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        // Gelecek randevuları tarihine göre azalan sırada sıralayın
        const upcomingAppointments = patient.appointments
            .filter(appointment => appointment.date > new Date())
            .sort((a, b) => new Date(b.date) - new Date(a.date));

        // Geçmiş randevuları tarihine göre azalan sırada sıralayın
        const recentAppointments = patient.appointments
            .filter(appointment => appointment.date < new Date())
            .sort((a, b) => new Date(b.date) - new Date(a.date));

        res.json({ upcomingAppointments, recentAppointments });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};


export { getPatientHome };