import Polyclinic from "../../models/polyclinic.model.js";
import Hospital from "../../models/hospital.model.js";
import Doctor from "../../models/doctor.model.js";

const getPolyclinics = async (req, res) => {
    try {
        const hospitalId = req.params.id;

        const hospital = await Hospital.findById(hospitalId).populate({
            path: 'polyclinics',
            match: { hospital: hospitalId }
        });

        if (!hospital) {
            return res.status(404).json({ message: 'Hospital not found' });
        }

        return res.status(200).json({ polyclinics: hospital.polyclinics });
    } catch (error) {
        return res.status(500).json({ message: 'Error in admin.polyclinic.controller: ' + error.message });
    }
};


const newPolyclinic = async (req, res) => {
    try {
        const { name, hospitalId, doctorIds = [] } = req.body;

        if (!name || !hospitalId) {
            return res.status(400).json({ message: 'All required fields must be provided' });
        }

        const hospital = await Hospital.findById(hospitalId).select('polyclinics').populate('polyclinics');

        if (!hospital) {
            return res.status(404).json({ message: 'Hospital not found' });
        }

        const polyclinicExists = hospital.polyclinics.find(polyclinic => polyclinic.name === name);

        if (polyclinicExists) {
            return res.status(400).json({ message: 'Polyclinic already exists in this hospital' });
        }

        let polyclinic = await Polyclinic.create({
            name,
            hospital: hospital._id,
            doctors: doctorIds
        });

        for (let i = 0; i < doctorIds.length; i++) {
            const doctor = await Doctor.findById(doctorIds[i]);
            if (doctor) {
                doctor.polyclinic = polyclinic._id;
                doctor.hospital = hospital._id;
                await doctor.save();
            }
        }

        hospital.polyclinics.push(polyclinic._id);
        await hospital.save();

        return res.status(201).json({ message: 'Polyclinic created successfully', polyclinic });

    } catch (error) {
        return res.status(500).json({ message: 'Error in admin.newpolyclinic.controller: ' + error.message });
    }
};

const updatePolyclinic = async (req, res) => {
    try {
        const { name, doctors = [] } = req.body;

        const polyclinic = await Polyclinic.findById(req.params.id).populate('hospital');

        if (!polyclinic) {
            return res.status(404).json({ message: 'Polyclinic not found' });
        }

        // Polyclinic adını güncelle
        polyclinic.name = name || polyclinic.name;

        const doctorsToRemove = polyclinic.doctors.filter(
            (doctor) => !doctors.includes(doctor.toString())
        );

        for (const doctorId of doctors) {
            const doctor = await Doctor.findById(doctorId);
            if (doctor && !polyclinic.doctors.includes(doctorId)) {
                polyclinic.doctors.push(doctorId);
                doctor.polyclinic = polyclinic._id;
                doctor.hospital = polyclinic.hospital._id;
                await doctor.save();
            }
        }

        for (const doctorId of doctorsToRemove) {
            const doctor = await Doctor.findById(doctorId);
            if (doctor) {
                doctor.polyclinic = null;
                doctor.hospital = null;
                await doctor.save();
            }
        }

        polyclinic.doctors = doctors;

        // Polyclinic'i kaydet
        await polyclinic.save();

        return res.status(200).json({ message: 'Polyclinic updated successfully', polyclinic });
    } catch (error) {
        return res.status(500).json({ message: 'Error in admin.updatepolyclinic.controller: ' + error.message });
    }
};

const deletePolyclinic = async (req, res) => {
    try {
        await Polyclinic.findByIdAndDelete(req.params.id);

        return res.status(200).json({ message: 'Polyclinic deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'error in admin.deletepolyclinic.controller ' + error.message });
    }
}

export { getPolyclinics, newPolyclinic, updatePolyclinic, deletePolyclinic };

