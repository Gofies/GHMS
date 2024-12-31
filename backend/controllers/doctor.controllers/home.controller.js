import Doctor from "../../models/doctor.model.js";

const getDoctorHome = async (req, res) => {
    try {
        console.log(req.user.id);

        // Fetch the doctor's appointments and lab tests
        const doctor = await Doctor.findById(req.user.id)
            .select('appointments labtests') // Select appointments and labtests fields
            .populate({
                path: 'appointments', // Populate appointments
                populate: [
                    {
                        path: 'tests', // Populate tests within appointments
                        model: 'LabTest'
                    },
                    {
                        path: 'hospital', // Populate hospital field
                        select: 'name' // Select only name field from hospital
                    },
                    {
                        path: 'patient', // Populate patient field
                        select: 'name surname' // Select name and surname fields
                    }
                ]
            })
            .populate({
                path: 'labtests', // Populate labtests
                model: 'LabTest',
                populate: {
                    path: 'patient', // Populate patient field in labtests
                    select: 'name surname' // Select name and surname fields
                }
            });

        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        // All appointments for the doctor
        const allAppointments = doctor.appointments;

        return res.status(200).json({
            message: 'Doctor home data retrieved successfully',
            allAppointments,
            labtests: doctor.labtests // All lab tests
        });
    } catch (error) {
        console.error(error, 'Error in getDoctorHome controller');
        res.status(500).send('Server Error');
    }
};

export { getDoctorHome };
