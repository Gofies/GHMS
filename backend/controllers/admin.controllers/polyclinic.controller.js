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
        const { name, hospitalId, doctorIds = [] } = req.body;

        if (!name || !hospitalId) {
            return res.status(400).json({ message: 'All required fields must be provided' });
        }

        // Hastaneyi bulun
        const hospital = await Hospital.findById(hospitalId).select('polyclinics').populate('polyclinics');

        if (!hospital) {
            return res.status(404).json({ message: 'Hospital not found' });
        }

        // Polikliniğin aynı hastane altında mevcut olup olmadığını kontrol et
        const polyclinicExists = hospital.polyclinics.find(polyclinic => polyclinic.name === name);

        if (polyclinicExists) {
            return res.status(400).json({ message: 'Polyclinic already exists in this hospital' });
        }

        // Yeni polikliniği oluştur
        let polyclinic = await Polyclinic.create({
            name,
            hospital: hospital._id,
            doctors: doctorIds
        });

        // Doktorların `hospital` ve `polyclinic` alanlarını güncelle
        for (let i = 0; i < doctorIds.length; i++) {
            const doctor = await Doctor.findById(doctorIds[i]);
            if (doctor) {
                doctor.polyclinic = polyclinic._id;
                doctor.hospital = hospital._id;
                await doctor.save();
            }
        }

        // Poliklinik ID'sini hastane poliklinik listesine ekle
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

        // Polikliniği bulun
        const polyclinic = await Polyclinic.findById(req.params.id).populate('hospital');

        if (!polyclinic) {
            return res.status(404).json({ message: 'Polyclinic not found' });
        }

        // Poliklinik adını güncelle
        polyclinic.name = name || polyclinic.name;

        // Poliklinikten çıkarılacak doktorları bul
        const doctorsToRemove = polyclinic.doctors.filter(
            (doctor) => !doctors.includes(doctor.toString())
        );

        // Yeni doktorları polikliniğe ekle ve hospital alanını güncelle
        for (const doctorId of doctors) {
            const doctor = await Doctor.findById(doctorId);
            if (doctor && !polyclinic.doctors.includes(doctorId)) {
                polyclinic.doctors.push(doctorId);
                doctor.polyclinic = polyclinic._id;
                doctor.hospital = polyclinic.hospital._id; // Poliklinikle aynı hastane
                await doctor.save();
            }
        }

        // Poliklinikten çıkarılacak doktorların `polyclinic` ve `hospital` alanlarını null yap
        for (const doctorId of doctorsToRemove) {
            const doctor = await Doctor.findById(doctorId);
            if (doctor) {
                doctor.polyclinic = null;
                doctor.hospital = null;
                await doctor.save();
            }
        }

        // Poliklinik doktor listesini güncelle
        polyclinic.doctors = doctors;

        // Polikliniği kaydet
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

