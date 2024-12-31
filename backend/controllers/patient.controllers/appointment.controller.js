import Patient from '../../models/patient.model.js';
import Doctor from '../../models/doctor.model.js';
import Appointment from '../../models/appointment.model.js';
import Polyclinic from '../../models/polyclinic.model.js';
import jwt from 'jsonwebtoken';
import Hospital from '../../models/hospital.model.js';
import LabTest from '../../models/lab.test.model.js';


const getHospitalByPolyclinic = async (req, res, next) => {
    try {
        // Validate required query parameters
        if (!req.query.city) {
            return res.status(400).json({ message: 'City is required' });
        }
        if (!req.query.polyclinicName) {
            return res.status(400).json({ message: 'Polyclinic name is required' });
        }

        // Fetch polyclinics and populate the fields
        let polyclinics = await Polyclinic.find({ name: req.query.polyclinicName })
            .populate('hospital', 'name address')
            .populate('doctors', 'name surname schedule');

        // Filter polyclinics by city
        polyclinics = polyclinics.filter(polyclinic => polyclinic.hospital.address.includes(req.query.city));

        // Prepare the results
        const queryResults = [];
        for (const polyclinic of polyclinics) {
            const { hospital, doctors } = polyclinic;

            // Update schedule for each doctor
            for (const doctor of doctors) {
                await doctor.updateSchedule(); // Await the updateSchedule method
            }

            queryResults.push({ hospital, doctors });
        }

        // Respond with the results
        return res.status(200).json({ queryResults });

    } catch (error) {
        console.error('Error in getHospitalByPolyclinic:', error);
        return res.status(500).json({ message: `Error in patient.middleware.getHospitalByPolyclinic: ${error.message}` });
    }
};


const newAppointment = async (req, res) => {
    try {
        const { doctorId, date, time, type, testType } = req.body;

        const doctor = await Doctor.findById(doctorId);

        const token = req.cookies.accessToken;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const patientId = decoded.id;

        const polyclinic = doctor.polyclinic;
        const hospital = doctor.hospital;

        const scheduleDay = doctor.schedule.find(day =>
            new Date(day.date).toISOString().slice(0, 10) === new Date(date).toISOString().slice(0, 10)
        );

        const appointment = await Appointment.create({
            doctor: doctorId,
            patient: patientId,
            doctorName: doctor.name + ' ' + doctor.surname,
            polyclinic: polyclinic,
            hospital: hospital,
            date: scheduleDay.date,
            time,
            status: 'Scheduled',
            type,
        });

        if (type === 'labtest') {
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




        if (!scheduleDay) {
            return res.status(400).json({ message: 'Invalid date; no schedule exists for the doctor on the specified date.' });
        }

        const timeSlot = scheduleDay.timeSlots.find(slot => slot.time === time);

        if (!timeSlot) {
            return res.status(400).json({ message: 'Invalid time; no time slot exists for the doctor at the specified time.' });
        }

        if (!timeSlot.isFree) {
            return res.status(400).json({ message: 'Time slot is already booked.' });
        }

        timeSlot.isFree = false;

        await doctor.save();

        return res.status(201).json({ message: 'Appointment created successfully', appointment });

    } catch (error) {
        return res.status(500).json({ message: "patient.newAppointment: " + error.message });
    }
};

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

        // KONTROL ET BURAYI
        if (appointments) {
            // Randevuların durumunu kontrol et ve güncelle
            const currentDate = new Date();
            for (const appointment of appointments) {
                if (new Date(appointment.date) < currentDate && appointment.status === 'Scheduled') {
                    appointment.status = 'Completed';
                    await appointment.save(); // Durumu kaydet
                }
            }

            // Tarihe göre sıralama (yeniden eskiye)
            appointments.sort((a, b) => new Date(b.date) - new Date(a.date));

            return res.status(200).json({
                message: 'Appointments retrieved successfully',
                appointments,
            });
        }
    } catch (error) {
        return res.status(500).json({ message: "patient.getAppointments: " + error.message });
    }
}


// const cancelAppointment = async (req, res) => {
//     try {
//         const { id } = req.params;

//         if (id === undefined) {
//             return res.status(400).json({ message: 'Appointment ID is required' });
//         }

//         const appointment = await Appointment.findById(id);

//         if (!appointment) {
//             return res.status(404).json({ message: 'Appointment not found' });
//         }

//         await Appointment.findByIdAndDelete(id);

//         return res.status(200).json({ message: 'Appointment cancelled successfully' });
//     }
//     catch (error) {
//         return res.status(500).json({ message: "patient.cancelAppointment: " + error.message });
//     }
// }

const cancelAppointment = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if appointment ID is provided
        if (!id) {
            return res.status(400).json({ message: 'Appointment ID is required' });
        }

        // Find the appointment and populate related data
        const appointment = await Appointment.findById(id).populate('patient').populate('doctor');

        // Check if appointment exists
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        // Check if the appointment belongs to the current patient
        if (!appointment.patient.equals(req.user._id)) {
            return res.status(403).json({ message: 'You are not authorized to cancel this appointment' });
        }
        

        // Update the time slot to make it free
        const doctor = await Doctor.findById(appointment.doctor);
        const scheduleDay = doctor.schedule.find(day =>
            new Date(day.date).toISOString().slice(0, 10) === new Date(appointment.date).toISOString().slice(0, 10)
        );

        if (scheduleDay) {
            const timeSlot = scheduleDay.timeSlots.find(slot => slot.time === appointment.time);
            if (timeSlot) {
                timeSlot.isFree = true; // Mark the time slot as free
            }
            await doctor.save(); // Save the updated schedule
        }

        // Remove the appointment from the patient's record
        await Patient.findByIdAndUpdate(req.user._id, {
            $pull: { appointments: id },
        });

        // Optionally, remove the appointment from the doctor's record
        await Doctor.findByIdAndUpdate(appointment.doctor, {
            $pull: { appointments: id },
        });

        // Delete the appointment
        await Appointment.findByIdAndDelete(id);

        return res.status(200).json({ message: 'Appointment cancelled successfully' });
    } catch (error) {
        console.error('Error in cancelAppointment:', error);
        return res.status(500).json({ message: "patient.cancelAppointment: " + error.message });
    }
};


export { getHospitalByPolyclinic, newAppointment, getAppointments, cancelAppointment };