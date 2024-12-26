import Patient from '../../models/patient.model.js';
import Doctor from '../../models/doctor.model.js';
import Appointment from '../../models/appointment.model.js';
import Polyclinic from '../../models/polyclinic.model.js';
import jwt from 'jsonwebtoken';
import Hospital from '../../models/hospital.model.js';
import LabTest from '../../models/lab.test.model.js';


const getHospitalByPolyclinic = async (req, res, next) => {
    try {
        if (!req.query.city) {
            return res.status(400).json({ message: 'City is required' });
        }
        if (!req.query.polyclinicName) {
            return res.status(400).json({ message: 'Polyclinic name is required' });
        }

        let polyclinics = await Polyclinic.find({ name: req.query.polyclinicName }).populate('hospital', 'name address').populate('doctors', 'name surname schedule');

        polyclinics = polyclinics.filter(polyclinic => polyclinic.hospital.address.includes(req.query.city));

        const queryResults = polyclinics.map(polyclinic => { return { hospital: polyclinic.hospital, doctors: polyclinic.doctors } });

        return res.status(200).json({ queryResults });

    } catch (error) {
        return res.status(500).json({ message: 'error in patient.middleware.getHospitalByPolyclinic ' + error.message });
    }
}

const newAppointment = async (req, res) => {
    try {
        const { doctorId, date, time, type, testType } = req.body;

        const doctor = await Doctor.findById(doctorId);

        const token = req.cookies.accessToken;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const patientId = decoded.id;

        const polyclinic = doctor.polyclinic;
        const hospital = doctor.hospital;

        const appointment = await Appointment.create({
            doctor: doctorId,
            patient: patientId,
            doctorName: doctor.name + ' ' + doctor.surname,
            polyclinic: polyclinic,
            hospital: hospital,
            date,
            time,
            status: 'Scheduled',
            type,
        });

        if (type === 'labtest') {
            console.log('labtest');
            const labtest = await LabTest.create({
                patient: patientId,
                doctor: doctorId,
                hospital: hospital,
                polyclinic: polyclinic,
                appointment: appointment._id,
                testtype: testType,
                status: 'pending',
                type: 'labtest'
            });

            appointment.tests.push(labtest._id);
            await appointment.save();

            await Hospital.findByIdAndUpdate(
                hospital,
                {
                    $addToSet: {
                        labTests: labtest._id,
                        appointments: appointment._id
                    }
                },
                { new: true } // Returns the updated document
            );

        }

        await Patient.findByIdAndUpdate(patientId, { $push: { appointments: appointment._id } });
        await Doctor.findByIdAndUpdate(doctorId, { $push: { appointments: appointment._id }, });



        return res.status(201).json({ message: 'Appointment created successfully', appointment });

    } catch (error) {
        return res.status(500).json({ message: "patient.newAppointment: " + error.message });
    }
}

const getAppointments = async (req, res) => {
    try {
        const patient = await Patient.findById(req.user._id)
            .select('appointments')
            .populate({
                select: 'doctor date time status',
                path: 'appointments',
                model: 'Appointment',
                populate: [
                    {
                        path: 'doctor',
                        model: 'Doctor',
                        select: 'name surname _id polyclinic',
                        populate: {
                            path: 'polyclinic',
                            model: 'Polyclinic',
                            select: 'name',
                        },
                    },
                ],
            });


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
        const { id } = req.params;

        if (id === undefined) {
            return res.status(400).json({ message: 'Appointment ID is required' });
        }

        const appointment = await Appointment.findById(id);

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        await Appointment.findByIdAndDelete(id);

        return res.status(200).json({ message: 'Appointment cancelled successfully' });
    }
    catch (error) {
        return res.status(500).json({ message: "patient.cancelAppointment: " + error.message });
    }
}

export { getHospitalByPolyclinic, newAppointment, getAppointments, cancelAppointment };