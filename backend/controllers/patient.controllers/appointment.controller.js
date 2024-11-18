import Patient from '../../models/patient.model.js';
import Doctor from '../../models/doctor.model.js';
import Appointment from '../../models/appointment.model.js';
import jwt from 'jsonwebtoken';

const newAppointment = async (req, res) => {
    try {
        const { doctorId, polyclinic, date, time, type } = req.body;

        const doctor = await Doctor.findById(doctorId);

        const token = req.cookies.accessToken;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const patientId = decoded.id;

        const appointment = await Appointment.create({
            doctor: doctorId,
            patient: patientId,
            doctorName: doctor.name + ' ' + doctor.surname,
            //polyclinic,
            date,
            time,
            status: 'Scheduled',
            type
        });



        await Patient.findByIdAndUpdate(patientId, { $push: { appointments: appointment._id } });

        return res.status(201).json({ message: 'Appointment created successfully', appointment });

    } catch (error) {
        return res.status(500).json({ message: "patient.newAppointment: " + error.message });
    }
}

const getAppointments = async (req, res) => {
    try {
        const token = req.cookies.accessToken;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const patientId = decoded.id;

        const patient = await Patient.findById(patientId)
            .select('appointments')
            .populate('appointments');

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
    } catch (error) {
        return res.status(500).json({ message: "patient.getAppointments: " + error.message });
    }
}

const cancelAppointment = async (req, res) => {
    try {
        const { appointmentId } = req.query;
        console.log(appointmentId);

        if (appointmentId === undefined) {
            return res.status(400).json({ message: 'Appointment ID is required' });
        }

        const appointment = await Appointment.findById(appointmentId);

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        await Appointment.findByIdAndDelete(appointmentId);

        return res.status(200).json({ message: 'Appointment cancelled successfully' });
    }
    catch (error) {
        return res.status(500).json({ message: "patient.cancelAppointment: " + error.message });
    }
}

export { newAppointment, getAppointments, cancelAppointment };