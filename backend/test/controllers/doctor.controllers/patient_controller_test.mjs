import {
    getPatients,
    getPatientTestResults,
    createPrescription,
    getPatientAppointmentHistory,
    getPatientDiagnosisHistory,
    getPatientFamilyHistory,
    getPatientPrescriptions,
    updatePrescription,
    deletePrescription,
} from 'backend/controllers/doctor.controllers/patient.controller.js';
import Doctor from '../../../models/doctor.model.js';
import Prescription from '../../../models/prescription.model.js';

jest.mock('../../../models/doctor.model.js');
jest.mock('../../../models/prescription.model.js');

describe('Patient Controller', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getPatients', () => {
        it('should retrieve patients successfully', async () => {
            const mockPatients = {
                appointments: [
                    {
                        patient: { name: 'John', surname: 'Doe', gender: 'male', birthdate: '1990-01-01' },
                        date: '2024-01-01',
                    },
                ],
            };

            Doctor.findById.mockImplementation(() => ({
                select: jest.fn().mockReturnThis(),
                populate: jest.fn().mockResolvedValue(mockPatients),
            }));

            const req = { user: { _id: 'doctorId123' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await getPatients(req, res);

            expect(Doctor.findById).toHaveBeenCalledWith('doctorId123');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Patients retrieved successfully',
                patients: mockPatients,
            });
        });

        it('should return 500 if an error occurs', async () => {
            Doctor.findById.mockImplementation(() => ({
                select: jest.fn().mockReturnThis(),
                populate: jest.fn().mockRejectedValue(new Error('Database error')),
            }));

            const req = { user: { _id: 'doctorId123' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await getPatients(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: 'doctor.getPatients: Database error',
            });
        });
    });

    describe('getPatientTestResults', () => {
        it('should return 400 if patientId is not provided', async () => {
            const req = { params: {} };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await getPatientTestResults(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Patient ID is required' });
        });

        it('should retrieve patient test results successfully', async () => {
            const mockLabTests = [{ testName: 'Blood Test', result: 'Normal' }];

            Doctor.findById.mockImplementation(() => ({
                populate: jest.fn().mockResolvedValue({
                    labtests: mockLabTests,
                }),
            }));

            const req = { user: { _id: 'doctorId123' }, params: { patientId: 'patientId123' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await getPatientTestResults(req, res);

            expect(Doctor.findById).toHaveBeenCalledWith('doctorId123');
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('createPrescription', () => {
        it('should return 400 if patientId is not provided', async () => {
            const req = { params: {}, body: {} };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await createPrescription(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Patient ID is required' });
        });

        it('should create a prescription successfully', async () => {
            const mockPatient = {
                prescriptions: [],
                save: jest.fn(),
            };

            const mockPrescription = {
                save: jest.fn().mockResolvedValue({
                    _id: 'prescriptionId123',
                    medicine: [{ name: 'Paracetamol', quantity: '10', time: 'Once a day' }],
                    status: 'active',
                }),
            };

            Doctor.findById.mockResolvedValue({
                appointments: [
                    { patient: mockPatient },
                ],
            });
            Prescription.mockImplementation(() => mockPrescription);

            const req = {
                user: { _id: 'doctorId123' },
                params: { patientId: 'patientId123' },
                body: { medicine: [{ name: 'Paracetamol', quantity: '10', time: 'Once a day' }], status: 'active' },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await createPrescription(req, res);

            expect(Doctor.findById).toHaveBeenCalledWith('doctorId123');
            expect(mockPrescription.save).not.toHaveBeenCalled();
            expect(mockPatient.prescriptions).not.toContain(mockPrescription);
            expect(mockPatient.save).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('updatePrescription', () => {
        it('should return 400 if prescriptionId is not provided', async () => {
            const req = { params: {}, body: {} };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await updatePrescription(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Prescription ID is required' });
        });

        it('should update a prescription successfully', async () => {
            const mockPrescription = {
                medicine: [],
                status: 'pending',
                save: jest.fn(),
            };

            Prescription.findById.mockResolvedValue(mockPrescription);

            const req = {
                params: { prescriptionId: 'prescriptionId123' },
                body: { medicine: [{ name: 'Ibuprofen', quantity: '20', time: 'Twice a day' }], status: 'active' },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await updatePrescription(req, res);

            expect(Prescription.findById).toHaveBeenCalledWith('prescriptionId123');
            expect(mockPrescription.medicine).toEqual(req.body.medicine);
            expect(mockPrescription.status).toEqual('active');
            expect(mockPrescription.save).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Prescription updated successfully',
                prescription: mockPrescription,
            });
        });
    });

    describe('deletePrescription', () => {
        it('should return 400 if prescriptionId is not provided', async () => {
            const req = { params: {} };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await deletePrescription(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Prescription ID is required' });
        });

        it('should delete a prescription successfully', async () => {
            Prescription.findByIdAndDelete.mockResolvedValue(true);

            const req = { params: { prescriptionId: 'prescriptionId123' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await deletePrescription(req, res);

            expect(Prescription.findByIdAndDelete).toHaveBeenCalledWith('prescriptionId123');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Prescription deleted successfully' });
        });
    });
});
