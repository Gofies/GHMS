import Hospital from '../../models/hospital.model.js';
import Polyclinic from '../../models/polyclinic.model.js';
import Doctor from '../../models/doctor.model.js';
import LabTest from '../../models/lab.test.model.js';

const getHospitals = async (req, res) => {
    try {
        const hospitals = await Hospital.find({}, 'name phone email');

        if (hospitals) {
            return res.status(200).json({ hospitals });
        }
    } catch (error) {
        return res.status(500).json({ message: 'error in admin.hospitals.controller ' + error.message });
    }
}

const getHospital = async (req, res) => {
    try {
        const hospital = await Hospital.findById(req.params.id).populate({
            path: 'doctors',
            select: 'name surname polyclinic',
            populate: {
                path: 'polyclinic',
                select: 'name'
            }
        }).populate({
            path: 'polyclinics',
            select: 'name doctors',
            populate: {
                path: 'doctors',
                select: 'name surname'
            }

        })
            .populate({
                path: 'labTests',
                select: 'patient testType urgency doctor',
                populate: [
                    {
                        path: 'patient',
                        model: 'Patient',
                        select: 'name surname'
                    },
                    {
                        path: 'doctor',
                        model: 'Doctor',
                        select: 'name surname'
                    }
                ]
            });

        if (hospital) {
            return res.status(200).json({ hospital });
        }
    } catch (error) {
        return res.status(500).json({ message: 'error in admin.gethospital.controller ' + error.message });
    }
}

const newHospital = async (req, res) => {
    try {
        const { name, address, selecteddoctors, establishmentdate, phone, email, polyclinics } = req.body;

        if (
            name === undefined ||
            address === undefined ||
            selecteddoctors === undefined ||
            establishmentdate === undefined ||
            phone === undefined ||
            email === undefined ||
            polyclinics === undefined
        ) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const hospitalExists = await Hospital.findOne({ $or: [{ name }, { email }] });

        if (hospitalExists) {
            return res.status(400).json({ message: 'Hospital already exists' });
        }

        const hospital = await Hospital.create({
            name,
            address,
            establishmentdate,
            phone,
            email
        });


        for (let i = 0; i < polyclinics.length; i++) {
            const polyclinic = await Polyclinic.create({ name: polyclinics[i], hospital: hospital._id });
            hospital.polyclinics.push(polyclinic._id);
        }

        for (let i = 0; i < selecteddoctors.length; i++) {
            hospital.doctors.push(selecteddoctors[i]);
        }

        await hospital.save();

        if (hospital) {
            return res.status(201).json({
                message: 'Hospital created successfully',
                hospital
            });
        }
    } catch (error) {
        return res.status(500).json({ message: 'error in admin.newhospital.controller ' + error.message });
    }
}

const updateHospital = async (req, res) => {
    try {
        const { name, address, doctors, establishmentdate, phone, email, polyclinics } = req.body;
        const hospital = await Hospital.findById(req.params.id);

        if (!hospital) {
            return res.status(404).json({ message: 'Hospital not found' });
        }

        hospital.name = name || hospital.name;
        hospital.address = address || hospital.address;
        hospital.establishmentdate = establishmentdate || hospital.establishmentdate;
        hospital.phone = phone || hospital.phone;
        hospital.email = email || hospital.email;

        if (polyclinics) {
            for (let i = 0; i < polyclinics.length; i++) {
                const polyclinic = await Polyclinic.create({ name: polyclinics[i].name, address: hospital.address, hospital: hospital._id });
                hospital.polyclinics.push(polyclinic._id);
            }
        }

        if (doctors) {
            for (let i = 0; i < doctors.length; i++) {
                hospital.doctors.push(doctors[i]);
            }

            for (let i = 0; i < doctors.length; i++) {
                const doctor = await Doctor.findById(doctors[i]);
                doctor.hospital = hospital._id;
                await doctor.save();
            }
        }


        await hospital.save();

        return res.status(200).json({ message: 'Hospital updated successfully', hospital });
    } catch (error) {
        return res.status(500).json({ message: 'error in admin.hospital.controller' + error.message });
    }
}


const deleteHospital = async (req, res) => {
    try {
        await Hospital.findByIdAndDelete(req.params.id);

        return res.status(200).json({ message: 'Hospital deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'error in admin.hospital.controller' + error.message });
    }
}

export { getHospitals, getHospital, newHospital, updateHospital, deleteHospital };