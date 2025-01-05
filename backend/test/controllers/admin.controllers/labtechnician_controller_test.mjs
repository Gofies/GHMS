import { newLabTechnician, getLabTechnician, getAllLabTechnicians, updateLabTechnician, deleteLabTechnician } from 'backend/controllers/admin.controllers/labtechnician.controller.js';
import LabTechnician from '../../../models/lab.technician.model.js';
import bcryptjs from 'bcryptjs';

jest.mock('../../../models/lab.technician.model.js');
jest.mock('bcryptjs');

describe('LabTechnician Controller', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('newLabTechnician', () => {
        it('should create a new lab technician', async () => {
            LabTechnician.findOne.mockResolvedValue(null); // No existing technician
            bcryptjs.hash.mockResolvedValue('hashedPassword');
            LabTechnician.prototype.save = jest.fn().mockResolvedValue();

            const req = {
                body: {
                    name: 'John',
                    surname: 'Doe',
                    title: 'Senior Technician',
                    email: 'john.doe@example.com',
                    password: 'password123',
                    birthdate: '1990-01-01',
                    phone: '1234567890',
                    jobstartdate: '2020-01-01',
                    specialization: 'Biochemistry',
                    certificates: ['Cert1', 'Cert2'],
                    hospital: 'hospitalId123',
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await newLabTechnician(req, res);

            expect(LabTechnician.findOne).toHaveBeenCalledWith({ email: 'john.doe@example.com' });
            expect(bcryptjs.hash).toHaveBeenCalledWith('password123', 10);
            expect(LabTechnician.prototype.save).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(201);
        });

        it('should return 400 if the technician already exists', async () => {
            LabTechnician.findOne.mockResolvedValue({ email: 'john.doe@example.com' });

            const req = {
                body: {
                    email: 'john.doe@example.com',
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await newLabTechnician(req, res);

            expect(LabTechnician.findOne).toHaveBeenCalledWith({ email: 'john.doe@example.com' });
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Lab Technician already exists' });
        });
    });

    describe('getLabTechnician', () => {
        it('should retrieve a lab technician by ID', async () => {
            LabTechnician.findById.mockImplementation(() => ({
                populate: jest.fn().mockReturnThis(),
                select: jest.fn().mockResolvedValue({
                    _id: 'tech123',
                    name: 'John Doe',
                    hospital: { name: 'General Hospital' },
                }),
            }));
    
            const req = { params: { id: 'tech123' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
    
            await getLabTechnician(req, res);
    
            expect(LabTechnician.findById).toHaveBeenCalledWith('tech123');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Lab Technician retrieved successfully',
                labTechnician: { _id: 'tech123', name: 'John Doe', hospital: { name: 'General Hospital' } },
            });
        });
    
        it('should return 500 if an error occurs', async () => {
            LabTechnician.findById.mockImplementation(() => ({
                populate: jest.fn().mockReturnThis(),
                select: jest.fn().mockRejectedValue(new Error('Database error')),
            }));
    
            const req = { params: { id: 'tech123' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
    
            await getLabTechnician(req, res);
    
            expect(LabTechnician.findById).toHaveBeenCalledWith('tech123');
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: 'admin.getLabTechnician :Database error',
            });
        });
    });

    describe('getAllLabTechnicians', () => {
        it('should retrieve all lab technicians', async () => {
            LabTechnician.find.mockResolvedValue([
                { name: 'John Doe', hospital: { name: 'General Hospital' } },
                { name: 'Jane Doe', hospital: { name: 'Specialist Clinic' } },
            ]);

            const req = {};
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await getAllLabTechnicians(req, res);

            expect(LabTechnician.find).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('updateLabTechnician', () => {
        it('should update a lab technician', async () => {
            LabTechnician.findByIdAndUpdate.mockResolvedValue({
                _id: 'tech123',
                name: 'Updated Name',
            });

            const req = { params: { id: 'tech123' }, body: { name: 'Updated Name' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await updateLabTechnician(req, res);

            expect(LabTechnician.findByIdAndUpdate).toHaveBeenCalledWith('tech123', { name: 'Updated Name' }, { new: true });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Lab Technician updated successfully',
                labTechnician: { _id: 'tech123', name: 'Updated Name' },
            });
        });
    });

    describe('deleteLabTechnician', () => {
        it('should delete a lab technician', async () => {
            LabTechnician.findByIdAndDelete.mockResolvedValue(true);

            const req = { params: { id: 'tech123' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await deleteLabTechnician(req, res);

            expect(LabTechnician.findByIdAndDelete).toHaveBeenCalledWith('tech123');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Lab Technician deleted successfully' });
        });
    });
});
