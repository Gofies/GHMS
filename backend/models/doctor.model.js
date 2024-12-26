import mongoose, { mongo } from 'mongoose';

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
            // Initialize 14-day schedule
            const schedule = [];
            const today = new Date();
            for (let i = 0; i < 14; i++) {
                const currentDay = new Date(today);
                currentDay.setDate(today.getDate() + i); // Add i days to today
                const timeSlots = [];
                for (let hour = 8; hour <= 16; hour++) {
                    timeSlots.push({
                        time: `${hour < 10 ? '0' : ''}${hour}:00`,
                        isFree: true
                    });
                }
                schedule.push({ date: currentDay, timeSlots });
            }
            return schedule;
        }
    }
}, { timestamps: true });

doctorSchema.methods.updateSchedule = async function () {
    // Remove the oldest day (yesterday)
    this.schedule.shift();

    // Add a new day (14th day from now)
    const today = new Date(this.schedule[this.schedule.length - 1].date);
    const newDay = new Date(today);
    newDay.setDate(today.getDate() + 1);

    const timeSlots = [];
    for (let hour = 8; hour <= 16; hour++) {
        timeSlots.push({
            time: `${hour < 10 ? '0' : ''}${hour}:00`,
            isFree: true
        });
    }

    this.schedule.push({ date: newDay, timeSlots });

    await this.save();
};

const Doctor = mongoose.model('Doctor', doctorSchema);

export default Doctor;

