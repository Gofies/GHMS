import Doctor from "../../models/doctor.model.js";

const getDoctorHome = async (req, res) => {
    try {
        console.log(req.user.id);

        const doctor = await Doctor.findById(req.user.id)
            .select('appointments labtests') 
            .populate({
                path: 'appointments', 
                populate: [
                    {
                        path: 'tests',
                        model: 'LabTest'
                    },
                    {
                        path: 'hospital', 
                        select: 'name'
                    },
                    {
                        path: 'patient',
                        select: 'name surname'
                    }
                ]
            })
            .populate({
                path: 'labtests', 
                model: 'LabTest',
                populate: [
                    {
                        path: 'patient', 
                        select: 'name surname'
                    },
                    {
                        path: 'labTechnician', 
                        select: 'name surname'
                    }
                ]
            });

        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        const allAppointments = doctor.appointments;

        return res.status(200).json({
            message: 'Doctor home data retrieved successfully',
            allAppointments,
            labtests: doctor.labtests
        });
    } catch (error) {
        console.error(error, 'Error in getDoctorHome controller');
        res.status(500).send('Server Error');
    }
};

export { getDoctorHome };
