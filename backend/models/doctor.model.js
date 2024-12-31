import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    birthdate: {
        type: Date,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    jobstartdate: {
        type: Date,
        required: true
    },
    degree: {
        type: String,
        required: true
    },
    specialization: {
        type: String,
        required: true
    },
    hospital: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hospital',
        default: null
    },
    polyclinic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Polyclinic',
        default: null
    },
    appointments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment'
    }],
    labtests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LabTest'
    }],
    role: {
        type: String,
        required: true
    },
    schedule: {
        type: [
            {
                date: { type: Date, required: true }, // Represents the specific date
                timeSlots: [
                    {
                        time: { type: String, required: true }, // Example: "08:00"
                        isFree: { type: Boolean, default: true }
                    }
                ]
            }
        ],
        default: () => {
            // Initialize 14-day schedule, weekdays only
            const schedule = [];
            const today = new Date();
            let daysAdded = 0;
            let currentDay = new Date(today);

            while (daysAdded < 14) {
                // Check if currentDay is a weekday (1 = Monday, 5 = Friday)
                if (currentDay.getDay() >= 1 && currentDay.getDay() <= 5) {
                    const timeSlots = [];
                    for (let hour = 8; hour <= 16; hour++) {
                        timeSlots.push({
                            time: `${hour < 10 ? '0' : ''}${hour}:00`,
                            isFree: true
                        });
                    }
                    schedule.push({ date: new Date(currentDay), timeSlots });
                    daysAdded++;
                }
                // Move to the next day
                currentDay.setDate(currentDay.getDate() + 1);
            }
            return schedule;
        }
    }
}, { timestamps: true });

doctorSchema.methods.updateSchedule = async function () {
    // Get tomorrow's date at midnight
    const tomorrow = new Date();
    tomorrow.setHours(0, 0, 0, 0);
    tomorrow.setDate(tomorrow.getDate() + 1);


    // Get the first date in the current schedule
    const firstDate = new Date(this.schedule[0]?.date);
    firstDate.setHours(0, 0, 0, 0); // Normalize time

    if (tomorrow > firstDate) {

        // Remove the first day
        this.schedule.shift();

        // Add a new weekday at the end
        let lastDate = new Date(this.schedule[this.schedule.length - 1]?.date);

        while (true) {
            lastDate.setDate(lastDate.getDate() + 1); // Move to the next day
            const dayOfWeek = lastDate.getDay(); // 0 = Sunday, 6 = Saturday
            if (dayOfWeek >= 1 && dayOfWeek <= 5) { // Monday to Friday
                const timeSlots = [];
                for (let hour = 8; hour <= 16; hour++) {
                    timeSlots.push({
                        time: `${hour < 10 ? '0' : ''}${hour}:00`,
                        isFree: true,
                    });
                }
                this.schedule.push({ date: new Date(lastDate), timeSlots });
                break; // Exit loop once a valid weekday is added
            }
        }

        // Mark the schedule field as modified for Mongoose
        this.markModified('schedule');

        // Save the updated schedule to the database
        await this.save();


    }
};


const Doctor = mongoose.model('Doctor', doctorSchema);

export default Doctor;
