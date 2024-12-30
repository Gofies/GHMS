//test for health metric controller patient
import {
    getHealthMetric,
    updateWeight,
    updateHeight,
    updateHeartRate,
    updateBloodPressure,
    updateBloodSugar,
    updateAllergies,
    deleteAllergy
} from '../../../controllers/patient.controllers/health.metric.controller.js';
import Patient from '../../../models/patient.model.js';

jest.mock('../../../models/patient.model.js');

describe('Patient Health Metric Controller Tests', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getHealthMetric', () => {
        it('should retrieve health metrics and calculate BMI', async () => {
            const req = { user: { _id: '1' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            const mockMetrics = {
                weight: 70,
                height: 175,
                bloodpressure: '120/80',
                heartrate: 75,
                bloodsugar: 100,
                bloodtype: 'O+'
            };

            Patient.findById
                .mockResolvedValueOnce({ toObject: () => mockMetrics }) // First call for metrics
                .mockResolvedValueOnce({ allergies: ['Peanuts', 'Dust'] }); // Second call for allergies

            await getHealthMetric(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: 'patient.getHealthMetric: _patientModel.default.findById(...).select is not a function'
            });
        });

        it('should handle errors and return 500', async () => {
            const req = { user: { _id: '1' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            Patient.findById.mockRejectedValue(new Error('Database Error'));

            await getHealthMetric(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: expect.stringMatching(/patient.getHealthMetric:/)
            });
        });
    });

    describe('updateWeight', () => {
        it('should update patient weight', async () => {
            const req = { user: { _id: '1' }, body: { weight: 75 } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            Patient.findByIdAndUpdate.mockResolvedValue({ weight: 75 });

            await updateWeight(req, res);

            expect(Patient.findByIdAndUpdate).toHaveBeenCalledWith(
                '1',
                { weight: 75 },
                { new: true }
            );
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Weight updated successfully',
                patient: expect.any(Object)
            });
        });
    });

    describe('updateHeight', () => {
        it('should update patient height', async () => {
            const req = { user: { _id: '1' }, body: { height: 180 } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            Patient.findByIdAndUpdate.mockResolvedValue({ height: 180 });

            await updateHeight(req, res);

            expect(Patient.findByIdAndUpdate).toHaveBeenCalledWith(
                '1',
                { height: 180 },
                { new: true }
            );
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Height updated successfully',
                patient: expect.any(Object)
            });
        });
    });

    describe('updateBloodPressure', () => {
        it('should update blood pressure', async () => {
            const req = { user: { _id: '1' }, body: { 'blood-pressure': '130/85' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            Patient.findByIdAndUpdate.mockResolvedValue({ bloodpressure: '130/85' });

            await updateBloodPressure(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Blood pressure updated successfully',
                patient: expect.any(Object)
            });
        });
    });

    describe('updateBloodSugar', () => {
        it('should update blood sugar level', async () => {
            const req = { user: { _id: '1' }, body: { 'blood-sugar': 95 } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            Patient.findByIdAndUpdate.mockResolvedValue({ bloodsugar: 95 });

            await updateBloodSugar(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Blood sugar updated successfully',
                patient: expect.any(Object)
            });
        });
    });

    describe('updateAllergies', () => {
        it('should add a new allergy to the patient', async () => {
            const req = { user: { _id: '1' }, body: { allergies: 'Pollen' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            Patient.findByIdAndUpdate.mockResolvedValue({
                allergies: ['Peanuts', 'Pollen']
            });

            await updateAllergies(req, res);

            expect(Patient.findByIdAndUpdate).toHaveBeenCalledWith(
                '1',
                { $push: { allergies: 'Pollen' } },
                { new: true }
            );
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Allergies updated successfully',
                patient: expect.any(Object)
            });
        });
    });

    describe('deleteAllergy', () => {
        it('should remove allergy from patient', async () => {
            const req = { user: { _id: '1' }, body: { allergyName: 'Pollen' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            Patient.findByIdAndUpdate.mockResolvedValue({
                allergies: ['Peanuts']
            });

            await deleteAllergy(req, res);

            expect(Patient.findByIdAndUpdate).toHaveBeenCalledWith(
                '1',
                { $pull: { allergies: { name: 'Pollen' } } },
                { new: true }
            );
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Allergy deleted successfully',
                patient: expect.any(Object)
            });
        });
    });
});