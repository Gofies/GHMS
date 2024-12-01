import Polyclinic from "../../models/polyclinic.model.js";
import Hospital from "../../models/hospital.model.js";
import Doctor from "../../models/doctor.model.js";

const getPolyclinics = async (req, res) => {
    try {
        const hospital = req.params.id;
        const polyclinics = await Hospital.findById(hospital).select('polyclinics').populate('polyclinics');

        if (polyclinics) {
            return res.status(200).json({ polyclinics });
        }
    } catch (error) {
        return res.status(500).json({ message: 'error in admin.polyclinic.controller ' + error.message });
    }
}

const newPolyclinic = async (req, res) => {
    try {
        // get hospital endpointine request attıktan sonra hastanedeki doktorları da seçip id array olarak gönderecek
        const { name, hospitalId, doctorIds } = req.body;

        if (
            name === undefined,
            hospitalId === undefined
        ) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const hospital = await Hospital.findById(hospitalId).select('polyclinics').populate('polyclinics');

        // check if hospital id we got from the req body has this polyclinic name in its array of polyclinics
        const polyclinicExists = hospital.polyclinics.find(polyclinic => polyclinic.name === name);

        if (polyclinicExists) {
            return res.status(400).json({ message: 'Polyclinic already exists' });
        }

        let polyclinic = await Polyclinic.create({
            name,
            hospital: hospital._id,
            doctors: doctorIds
        });

        for (let i = 0; i < doctorIds.length; i++) {
            let doctor = await Doctor.findById(doctorIds[i]);
            doctor.polyclinic = polyclinic._id;
            await doctor.save();
        }
        hospital.polyclinics.push(polyclinic);
        await hospital.save();
        await polyclinic.save();

        return res.status(201).json({ message: 'Polyclinic created successfully', polyclinic });

    } catch (error) {
        return res.status(500).json({ message: 'error in admin.newpolyclinic.controller ' + error.message });
    }
}

const updatePolyclinic = async (req, res) => {
    try {
        const { name, doctors } = req.body;
        const polyclinic = await Polyclinic.findById(req.params.id);

        if (!polyclinic) {
            return res.status(404).json({ message: 'Polyclinic not found' });
        }

        polyclinic.name = name || polyclinic.name;

        if (doctors.length > 0) {
            doctors.forEach(doctor => {
                if (!polyclinic.doctors.includes(doctor)) {
                    polyclinic.doctors.push(doctor);
                }
            });
        }

        for (let i = 0; i < doctors.length; i++) {
            let doctor = await Doctor.findById(doctors[i]);
            doctor.polyclinic = polyclinic._id;
            await doctor.save();
        }


        await polyclinic.save();

        return res.status(200).json({ message: 'Polyclinic updated successfully', polyclinic });
    } catch (error) {
        return res.status(500).json({ message: 'error in admin.updatepolyclinic.controller ' + error.message });
    }
}

const deletePolyclinic = async (req, res) => {
    try {
        await Polyclinic.findByIdAndDelete(req.params.id);

        return res.status(200).json({ message: 'Polyclinic deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'error in admin.deletepolyclinic.controller ' + error.message });
    }
}

export { getPolyclinics, newPolyclinic, updatePolyclinic, deletePolyclinic };

