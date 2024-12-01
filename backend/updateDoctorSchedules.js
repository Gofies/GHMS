import cron from 'node-cron';
import Doctor from './models/doctor.model.js';

// Daily schedule update for all doctors
cron.schedule('0 0 * * *', async () => {
    const doctors = await Doctor.find();
    for (const doctor of doctors) {
        await doctor.updateSchedule();
    }
    console.log('Schedules updated for all doctors');
});

export default cron;
