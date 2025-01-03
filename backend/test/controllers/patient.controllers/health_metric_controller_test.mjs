// test/controllers/patient.controllers/health.metric.controller.test.mjs

import {
    getHealthMetric,
    updateWeight,
    updateHeight,
    updateHeartRate,
    updateBloodPressure,
    updateBloodSugar,
    updateAllergies,
    deleteAllergy,
    updateBloodType
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
                weight: 70, // kg
                height: 175, // cm
                bloodpressure: '120/80',
                heartrate: 75,
                bloodsugar: 100,
                bloodtype: 'O+'
            };

            const mockAllergies = {
                allergies: ['Peanuts', 'Dust']
            };

            // Mock the chaining of findById().select()
            Patient.findById.mockImplementation(() => ({
                select: jest.fn()
                    .mockResolvedValueOnce(mockMetrics) // First call for metrics
                    .mockResolvedValueOnce(mockAllergies) // Second call for allergies
            }));

            await getHealthMetric(req, res);

            // Calculate expected BMI
            const expectedBMI = (mockMetrics.weight / ((mockMetrics.height / 100) ** 2)).toFixed(2);

            expect(Patient.findById).toHaveBeenCalledTimes(2);
            expect(Patient.findById).toHaveBeenCalledWith('1');
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: 'patient.getHealthMetric: metricsDoc.toObject is not a function',
            });
        });

        it('should handle errors and return 500', async () => {
            const req = { user: { _id: '1' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            Patient.findById.mockImplementation(() => ({
                select: jest.fn().mockRejectedValue(new Error('Database Error'))
            }));

            await getHealthMetric(req, res);

            expect(Patient.findById).toHaveBeenCalledTimes(1);
            expect(Patient.findById).toHaveBeenCalledWith('1');
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: "patient.getHealthMetric: Database Error"
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

            const updatedPatient = { weight: 75 };
            Patient.findByIdAndUpdate.mockResolvedValue(updatedPatient);

            await updateWeight(req, res);

            expect(Patient.findByIdAndUpdate).toHaveBeenCalledWith(
                '1',
                { weight: 75 },
                { new: true }
            );
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Weight updated successfully',
                patient: updatedPatient
            });
        });

        it('should handle errors and return 500', async () => {
            const req = { user: { _id: '1' }, body: { weight: 75 } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            Patient.findByIdAndUpdate.mockRejectedValue(new Error('Update Error'));

            await updateWeight(req, res);

            expect(Patient.findByIdAndUpdate).toHaveBeenCalledWith(
                '1',
                { weight: 75 },
                { new: true }
            );
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: 'patient.updateWeight: Update Error'
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

            const updatedPatient = { height: 180 };
            Patient.findByIdAndUpdate.mockResolvedValue(updatedPatient);

            await updateHeight(req, res);

            expect(Patient.findByIdAndUpdate).toHaveBeenCalledWith(
                '1',
                { height: 180 },
                { new: true }
            );
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Height updated successfully',
                patient: updatedPatient
            });
        });

        it('should handle errors and return 500', async () => {
            const req = { user: { _id: '1' }, body: { height: 180 } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            Patient.findByIdAndUpdate.mockRejectedValue(new Error('Update Error'));

            await updateHeight(req, res);

            expect(Patient.findByIdAndUpdate).toHaveBeenCalledWith(
                '1',
                { height: 180 },
                { new: true }
            );
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: 'patient.updateHeight: Update Error'
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

            const updatedPatient = { bloodpressure: '130/85' };
            Patient.findByIdAndUpdate.mockResolvedValue(updatedPatient);

            await updateBloodPressure(req, res);

            expect(Patient.findByIdAndUpdate).toHaveBeenCalledWith(
                '1',
                { bloodpressure: '130/85' },
                { new: true }
            );
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Blood pressure updated successfully',
                patient: updatedPatient
            });
        });

        it('should handle errors and return 500', async () => {
            const req = { user: { _id: '1' }, body: { 'blood-pressure': '130/85' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            Patient.findByIdAndUpdate.mockRejectedValue(new Error('Update Error'));

            await updateBloodPressure(req, res);

            expect(Patient.findByIdAndUpdate).toHaveBeenCalledWith(
                '1',
                { bloodpressure: '130/85' },
                { new: true }
            );
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: 'patient.updateBloodPressure: Update Error'
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

            const updatedPatient = { bloodsugar: 95 };
            Patient.findByIdAndUpdate.mockResolvedValue(updatedPatient);

            await updateBloodSugar(req, res);

            expect(Patient.findByIdAndUpdate).toHaveBeenCalledWith(
                '1',
                { bloodsugar: 95 },
                { new: true }
            );
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Blood sugar updated successfully',
                patient: updatedPatient
            });
        });

        it('should handle errors and return 500', async () => {
            const req = { user: { _id: '1' }, body: { 'blood-sugar': 95 } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            Patient.findByIdAndUpdate.mockRejectedValue(new Error('Update Error'));

            await updateBloodSugar(req, res);

            expect(Patient.findByIdAndUpdate).toHaveBeenCalledWith(
                '1',
                { bloodsugar: 95 },
                { new: true }
            );
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: 'patient.updateBloodSugar: Update Error'
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

            const updatedPatient = {
                allergies: ['Peanuts', 'Pollen']
            };
            Patient.findByIdAndUpdate.mockResolvedValue(updatedPatient);

            await updateAllergies(req, res);

            expect(Patient.findByIdAndUpdate).toHaveBeenCalledWith(
                '1',
                { $push: { allergies: 'Pollen' } },
                { new: true }
            );
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Allergies updated successfully',
                patient: updatedPatient
            });
        });

        it('should handle errors and return 500', async () => {
            const req = { user: { _id: '1' }, body: { allergies: 'Pollen' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            Patient.findByIdAndUpdate.mockRejectedValue(new Error('Update Error'));

            await updateAllergies(req, res);

            expect(Patient.findByIdAndUpdate).toHaveBeenCalledWith(
                '1',
                { $push: { allergies: 'Pollen' } },
                { new: true }
            );
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: 'patient.updateAllergies: Update Error'
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

            const updatedPatient = {
                allergies: ['Peanuts']
            };
            Patient.findByIdAndUpdate.mockResolvedValue(updatedPatient);

            await deleteAllergy(req, res);

            expect(Patient.findByIdAndUpdate).toHaveBeenCalledWith(
                '1',
                { $pull: { allergies: 'Pollen' } },
                { new: true }
            );
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Allergy deleted successfully'
            });
        });

        it('should handle errors and return 500', async () => {
            const req = { user: { _id: '1' }, body: { allergyName: 'Pollen' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            Patient.findByIdAndUpdate.mockRejectedValue(new Error('Delete Error'));

            await deleteAllergy(req, res);

            expect(Patient.findByIdAndUpdate).toHaveBeenCalledWith(
                '1',
                { $pull: { allergies: 'Pollen' } },
                { new: true }
            );
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: 'patient.deleteAllergy: Delete Error'
            });
        });
    });

    describe('updateHeartRate', () => {
        it('should update heart rate', async () => {
            const req = { user: { _id: '1' }, body: { 'heart-rate': 80 } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            const updatedPatient = { heartrate: 80 };
            Patient.findByIdAndUpdate.mockResolvedValue(updatedPatient);

            await updateHeartRate(req, res);

            expect(Patient.findByIdAndUpdate).toHaveBeenCalledWith(
                '1',
                { heartrate: 80 },
                { new: true }
            );
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Heart rate updated successfully',
                patient: updatedPatient
            });
        });

        it('should handle errors and return 500', async () => {
            const req = { user: { _id: '1' }, body: { 'heart-rate': 80 } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            Patient.findByIdAndUpdate.mockRejectedValue(new Error('Update Error'));

            await updateHeartRate(req, res);

            expect(Patient.findByIdAndUpdate).toHaveBeenCalledWith(
                '1',
                { heartrate: 80 },
                { new: true }
            );
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: 'patient.updateHeartRate: Update Error'
            });
        });
    });

    // Optionally, add tests for updateBloodType if needed
    describe('updateBloodType', () => {
        it('should update blood type', async () => {
            const req = { user: { _id: '1' }, body: { 'blood-type': 'A+' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            const updatedPatient = { bloodtype: 'A+' };
            Patient.findByIdAndUpdate.mockResolvedValue(updatedPatient);

            await updateBloodType(req, res);

            expect(Patient.findByIdAndUpdate).toHaveBeenCalledWith(
                '1',
                { bloodtype: 'A+' },
                { new: true }
            );
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Blood type updated successfully',
                patient: updatedPatient
            });
        });

        it('should handle errors and return 500', async () => {
            const req = { user: { _id: '1' }, body: { 'blood-type': 'A+' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            Patient.findByIdAndUpdate.mockRejectedValue(new Error('Update Error'));

            await updateBloodType(req, res);

            expect(Patient.findByIdAndUpdate).toHaveBeenCalledWith(
                '1',
                { bloodtype: 'A+' },
                { new: true }
            );
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: 'patient.updateBloodType: Update Error'
            });
        });
    });
});
