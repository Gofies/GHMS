import Polyclinic from "../../models/polyclinic.model.js";
import Hospital from "../../models/hospital.model.js";
import Doctor from "../../models/doctor.model.js";

const getPolyclinics = async (req, res) => {
    try {
        const hospitalId = req.params.id; // İlgili hastanenin ID'si

        // Hastane verilerini bul ve polikliniklerini getir
        const hospital = await Hospital.findById(hospitalId).populate({
            path: 'polyclinics',
            match: { hospital: hospitalId } // Sadece ilgili hastaneye ait poliklinikler
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

        // Polyclinic adını güncelle
        polyclinic.name = name || polyclinic.name;

        // Polyclinic'ten çıkarılacak doktorları bul
        const doctorsToRemove = polyclinic.doctors.filter(
            (doctor) => !doctors.includes(doctor.toString())
        );

        // Polyclinic'e yeni doktorları ekle
        doctors.forEach((doctor) => {
            if (!polyclinic.doctors.includes(doctor)) {
                polyclinic.doctors.push(doctor);
            }
        });

        // Çıkarılacak doktorların `polyclinic` alanını null yap
        for (const doctorId of doctorsToRemove) {
            const doctor = await Doctor.findById(doctorId);
            if (doctor) {
                doctor.polyclinic = null;
                await doctor.save();
            }
        }

        // Polyclinic'e eklenen doktorların `polyclinic` alanını güncelle
        for (const doctorId of doctors) {
            const doctor = await Doctor.findById(doctorId);
            if (doctor) {
                doctor.polyclinic = polyclinic._id;
                await doctor.save();
            }
        }

        // Polyclinic'in doktor listesini güncelle
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

