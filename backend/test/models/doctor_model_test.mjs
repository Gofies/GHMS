// tests/models/doctor.model.test.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Doctor from 'backend/models/doctor.model.js';
import Hospital from 'backend/models/hospital.model.js';
import Polyclinic from 'backend/models/polyclinic.model.js';

dotenv.config({ path: '../../.env' });

const DATABASE_URI = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@router01:27117/TestHospitalDatabase?authSource=admin`;

describe('Doctor Model', () => {
  beforeAll(async () => {
    await mongoose.connect(DATABASE_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  /**
   * Helper Function to Create a Doctor with Custom Schedule
   */
  const createDoctorWithSchedule = async (scheduleDates) => {
    const timeSlots = [];
    for (let hour = 8; hour <= 16; hour++) {
      timeSlots.push({
        time: `${hour < 10 ? '0' : ''}${hour}:00`,
        isFree: true,
      });
    }

    const schedule = scheduleDates.map(date => ({
      date: new Date(date),
      timeSlots: [...timeSlots],
    }));

    const doctor = new Doctor({
      name: 'Test',
      surname: 'Doctor',
      title: 'Dr.',
      email: 'test@doctor.com',
      password: 'password123',
      birthdate: new Date('1980-01-01'),
      phone: '1234567890',
      jobstartdate: new Date('2010-01-01'),
      degree: 'MD',
      specialization: 'General Medicine',
      role: 'doctor',
      schedule,
    });

    await doctor.save();
    return doctor;
  };

  /**
   * Test Case 1: Initialize Schedule Correctly
   */
  it('should initialize a 14-day weekday schedule with correct time slots', async () => {
    const doctor = await Doctor.create({
      name: 'TestDoctor',
      surname: 'Model',
      title: 'Dr.',
      email: 'testdoctor.model@example.com',
      password: '123456',
      birthdate: new Date('1980-01-01'),
      phone: '1234567890',
      jobstartdate: new Date('2010-01-01'),
      degree: 'MD',
      specialization: 'General',
      role: 'doctor'
    });

    expect(doctor.schedule).toHaveLength(14);
    // Additional checks for correctness
    doctor.schedule.forEach(day => {
      const dayOfWeek = new Date(day.date).getDay();
      expect(dayOfWeek).toBeGreaterThanOrEqual(1); // Monday
      expect(dayOfWeek).toBeLessThanOrEqual(5);    // Friday
      expect(day.timeSlots).toHaveLength(9);       // 08:00 to 16:00
    });
  });

  describe('updateSchedule method', () => {
    let doctor;

    beforeEach(async () => {
      doctor = new Doctor({
        name: 'UpdateSchedule',
        surname: 'Tester',
        title: 'Dr.',
        email: 'update.schedule@example.com',
        password: 'test1234',
        birthdate: new Date('1980-01-01'),
        phone: '1111111111',
        jobstartdate: new Date('2010-01-01'),
        degree: 'MD',
        specialization: 'Testing',
        role: 'doctor'
      });
      await doctor.save();
    });

    it('should do nothing if the first schedule date is still valid', async () => {
      // The default schedule's first date is usually tomorrow or a future weekday
      // So no shift should occur
      await doctor.updateSchedule();
      // Should remain 14 days
      expect(doctor.schedule).toHaveLength(14);
    });

    it('should remove the first day if it is in the past and add a new weekday', async () => {
      // Force the first day to be in the past
      doctor.schedule[0].date = new Date(Date.now() - 24 * 60 * 60 * 1000); // Yesterday
      await doctor.save();

      await doctor.updateSchedule();
      // Still 14 days total
      expect(doctor.schedule).toHaveLength(14);

      // The new first day shouldn't match the old date
      const newFirstDate = new Date(doctor.schedule[0].date);
      expect(newFirstDate.getTime()).toBeGreaterThan(Date.now() - 24 * 60 * 60 * 1000);

      // Last day should be newly inserted
      const lastDate = new Date(doctor.schedule[doctor.schedule.length - 1].date);
      const dayOfWeek = lastDate.getDay();
      expect(dayOfWeek).toBeGreaterThanOrEqual(1); // Monday
      expect(dayOfWeek).toBeLessThanOrEqual(5); // Friday
    });

    it('should remove multiple past days', async () => {
      // Overwrite the default schedule with some custom days
      doctor.schedule = [];

      // 2 days in the past, 1 day in the future
      const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);

      doctor.schedule.push({ date: twoDaysAgo, timeSlots: [] });
      doctor.schedule.push({ date: yesterday, timeSlots: [] });
      doctor.schedule.push({ date: tomorrow, timeSlots: [] });
      await doctor.save();

      await doctor.updateSchedule();
      // Should still have 3 items (or your logic might keep 14)
      expect(doctor.schedule).toHaveLength(3);

      // The first date should now be tomorrow (past ones removed)
      const firstDate = new Date(doctor.schedule[0].date).toDateString();
      expect(firstDate).toBe("Thu Jan 02 2025");
    });

    it('should handle an empty schedule gracefully', async () => {
      doctor.schedule = [];
      await doctor.save();

      await doctor.updateSchedule();
      // Depending on your logic, it might re-initialize the schedule or remain empty
      // Adjust the expectation accordingly
      expect(doctor.schedule.length).toBe(0); // Assuming it remains empty
    });

    it('should correctly generate time slots from 08:00 to 16:00', async () => {
      // Create a doctor with a specific schedule date
      const specificDate = new Date();
      specificDate.setDate(specificDate.getDate() + 1);
      specificDate.setHours(0, 0, 0, 0);

      const doctorWithSpecificSchedule = await Doctor.create({
        name: 'Specific',
        surname: 'TimeSlots',
        title: 'Dr.',
        email: 'specific.timeslots@example.com',
        password: 'password123',
        birthdate: new Date('1990-07-22'),
        phone: '8888888888',
        jobstartdate: new Date('2012-08-01'),
        degree: 'MD',
        specialization: 'Dermatology',
        role: 'doctor',
        schedule: [
          {
            date: specificDate,
            timeSlots: [
              { time: '08:00', isFree: true },
              { time: '09:00', isFree: true },
              { time: '10:00', isFree: true },
              { time: '11:00', isFree: true },
              { time: '12:00', isFree: true },
              { time: '13:00', isFree: true },
              { time: '14:00', isFree: true },
              { time: '15:00', isFree: true },
              { time: '16:00', isFree: true }
            ]
          }
        ]
      });

      doctorWithSpecificSchedule.schedule.forEach(day => {
        expect(day.timeSlots).toHaveLength(9); // 08:00 to 16:00 inclusive
        day.timeSlots.forEach((slot, index) => {
          const expectedHour = 8 + index;
          const expectedTime = `${expectedHour < 10 ? '0' : ''}${expectedHour}:00`;
          expect(slot.time).toBe(expectedTime);
          expect(slot.isFree).toBe(true);
        });
      });
    });

    it('should correctly mark a time slot as free after cancellation', async () => {
      // Create a doctor with a specific schedule date and time slot
      const specificDate = new Date();
      specificDate.setDate(specificDate.getDate() + 1);
      specificDate.setHours(0, 0, 0, 0);

      const doctorWithSpecificSchedule = await Doctor.create({
        name: 'Cancellation',
        surname: 'Tester',
        title: 'Dr.',
        email: 'cancellation.tester@example.com',
        password: 'password123',
        birthdate: new Date('1988-07-22'),
        phone: '8888888888',
        jobstartdate: new Date('2012-08-01'),
        degree: 'MD',
        specialization: 'Dermatology',
        role: 'doctor',
        schedule: [
          {
            date: specificDate,
            timeSlots: [
              { time: '09:00', isFree: false }, // Booked
              { time: '10:00', isFree: true }
            ]
          }
        ]
      });

      // Simulate cancellation by marking '09:00' as free
      doctorWithSpecificSchedule.schedule[0].timeSlots.find(slot => slot.time === '09:00').isFree = true;
      await doctorWithSpecificSchedule.save();

      const updatedDoctor = await Doctor.findById(doctorWithSpecificSchedule._id);
      const slot = updatedDoctor.schedule[0].timeSlots.find(slot => slot.time === '09:00');
      expect(slot.isFree).toBe(true);
    });

    it('should correctly handle adding a new weekday after Friday by skipping weekend', async () => {
      // Create a doctor with a schedule ending on Friday
      const today = new Date();
      const daysUntilFriday = (5 - today.getDay() + 7) % 7; // Days until next Friday
      const friday = new Date(today);
      friday.setDate(today.getDate() + daysUntilFriday);
      friday.setHours(0, 0, 0, 0);

      const scheduleDates = [];
      for (let i = 0; i < 14; i++) {
        const date = new Date(friday);
        date.setDate(friday.getDate() + i + 1);
        if (date.getDay() >= 1 && date.getDay() <= 5) { // Weekdays only
          scheduleDates.push(date);
        }
      }

      const doctor = await Doctor.create({
        name: 'Friday',
        surname: 'End',
        title: 'Dr.',
        email: 'friday.end@example.com',
        password: 'password123',
        birthdate: new Date('1980-05-05'),
        phone: '9999999999',
        jobstartdate: new Date('2005-06-01'),
        degree: 'MD',
        specialization: 'Trauma Surgery',
        role: 'doctor',
        schedule: scheduleDates.map(date => ({
          date,
          timeSlots: [
            { time: '08:00', isFree: true },
            { time: '09:00', isFree: true },
            { time: '10:00', isFree: true },
            { time: '11:00', isFree: true },
            { time: '12:00', isFree: true },
            { time: '13:00', isFree: true },
            { time: '14:00', isFree: true },
            { time: '15:00', isFree: true },
            { time: '16:00', isFree: true }
          ]
        }))
      });

      // Manually set the first schedule date to yesterday to trigger update
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);
      doctor.schedule[0].date = yesterday;
      await doctor.save();

      // Call updateSchedule
      await doctor.updateSchedule();

      // Fetch the updated doctor
      const updatedDoctor = await Doctor.findById(doctor._id);

      // Ensure the last day is Monday (skipped weekend)
      const lastScheduleDate = new Date(updatedDoctor.schedule[updatedDoctor.schedule.length -1].date);
      const dayOfWeek = lastScheduleDate.getDay();
      expect(dayOfWeek).toBe(1); // Monday
    });

    it('should handle adding a new day when multiple past days are present', async () => {
      // Create a doctor with multiple past days
      doctor.schedule = [
        { date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), timeSlots: [] },
        { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), timeSlots: [] },
        { date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), timeSlots: [] },
        { date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), timeSlots: [] },
      ];
      await doctor.save();

      await doctor.updateSchedule();

      // Fetch the updated doctor
      const updatedDoctor = await Doctor.findById(doctor._id);

      // Should have 4 schedule days, with the first three removed and a new weekday added
      expect(updatedDoctor.schedule).toHaveLength(4);
      const expectedDate = "Wed Jan 01 2025";
      expect(new Date(updatedDoctor.schedule[0].date).toDateString()).toBe(expectedDate);
      // Check that the new day added is a weekday
      const lastDate = new Date(updatedDoctor.schedule[updatedDoctor.schedule.length -1].date);
      const dayOfWeek = lastDate.getDay();
      expect(dayOfWeek).toBeGreaterThanOrEqual(1);
      expect(dayOfWeek).toBeLessThanOrEqual(5);
    });
  });
});
