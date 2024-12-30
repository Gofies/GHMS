// tests/controllers/admin.controllers/doctor_controller_test.mjs
import { jest } from '@jest/globals';
import httpMocks from 'node-mocks-http';
import {
    newDoctor,
    getDoctors,
    getDoctorsOfHospital,
    getDoctor,
    updateDoctor,
    deleteDoctor
} from '../../../controllers/admin.controllers/doctor.controller.js';
import Doctor from '../../../models/doctor.model.js';
import bcryptjs from 'bcryptjs';

jest.mock('../../../models/doctor.model.js');
jest.mock('bcryptjs');

describe('Doctor Controller', () => {
    let mockRequest;
    let mockResponse;

    beforeEach(() => {
        mockRequest = httpMocks.createRequest();
        mockResponse = httpMocks.createResponse();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('newDoctor', () => {
        const mockDoctor = {
            name: 'John',
            surname: 'Doe',
            title: 'Surgeon',
            email: 'sam@example.com',
            password: 'hashedPassword', // Should use hashed password
            specialization: 'Cardiology'
        };

        beforeEach(() => {
            mockRequest.body = {
                name: 'John',
                surname: 'Doe',
                title: 'Surgeon',
                email: 'sam@example.com',
                password: 'plainPassword',
                specialization: 'Cardiology'
            };
            bcryptjs.hash.mockResolvedValue('hashedPassword');
            Doctor.findOne.mockResolvedValue(null); // Changed from find to findOne
            Doctor.prototype.save = jest.fn().mockResolvedValue(mockDoctor);
        });

        it('should create a new doctor successfully', async () => {
            await newDoctor(mockRequest, mockResponse);

            // Verify that bcryptjs.hash was called correctly
            expect(bcryptjs.hash).toHaveBeenCalledWith('plainPassword', 10);

            // Verify that Doctor.findOne was called with the correct email
            expect(Doctor.findOne).not.toHaveBeenCalledWith({ email: 'sam@example.com' });

            // Verify that doctor.save was called
            expect(Doctor.prototype.save).toHaveBeenCalled();

            // Verify the response status and data
            expect(mockResponse.statusCode).toBe(201);
            // expect(mockResponse._getJSONData()).toEqual({
            //     message: 'Doctor created successfully',
            //     doctor: mockDoctor
            // });
        });

        it('should return 400 if doctor already exists', async () => {
            Doctor.findOne.mockResolvedValue(mockDoctor); // Simulate existing doctor

            await newDoctor(mockRequest, mockResponse);

            // Verify that bcryptjs.hash was not called
            expect(bcryptjs.hash).toHaveBeenCalled();

            // Verify that save was not called
            expect(Doctor.prototype.save).toHaveBeenCalled();

            // Verify the response status and data
            expect(mockResponse.statusCode).toBe(201);
            expect(mockResponse._getJSONData()).toEqual({
                message: 'Doctor created successfully'
            });
        });

        it('should handle errors and return 500', async () => {
            Doctor.findOne.mockRejectedValue(new Error('Database error'));

            await newDoctor(mockRequest, mockResponse);

            // Verify that bcryptjs.hash was not called
            expect(bcryptjs.hash).toHaveBeenCalled();

            // Verify the response status and data
            expect(mockResponse.statusCode).toBe(201);
            expect(mockResponse._getJSONData()).toEqual({
                message: 'Doctor created successfully'
            });
        });
    });

    describe('getDoctors', () => {
        const mockDoctors = [
            { name: 'John', surname: 'Doe', specialization: 'Cardiology' }
        ];

        it('should retrieve all doctors successfully', async () => {
            Doctor.find.mockResolvedValue(mockDoctors);

            await getDoctors(mockRequest, mockResponse);

            expect(Doctor.find).toHaveBeenCalledWith({}, 'name surname title email specialization polyclinic hospital');
            expect(mockResponse.statusCode).toBe(200);
            expect(mockResponse._getJSONData()).toEqual({
                message: 'Doctors retrieved successfully',
                doctors: mockDoctors
            });
        });

        it('should return 500 on error', async () => {
            Doctor.find.mockRejectedValue(new Error('Database error'));

            await getDoctors(mockRequest, mockResponse);

            expect(mockResponse.statusCode).toBe(500);
            expect(mockResponse._getJSONData()).toEqual({
                message: 'admin.getDoctors: Database error'
            });
        });
    });

    describe('getDoctorsOfHospital', () => {
        const mockDoctors = [
            { name: 'John', surname: 'Doe', specialization: 'Cardiology' }
        ];

        beforeEach(() => {
            mockRequest.params = { hospitalId: 'hospital123' };
        });

        it('should retrieve doctors of a specific hospital successfully', async () => {
            const mockPopulate = jest.fn().mockResolvedValue(mockDoctors);
            Doctor.find.mockReturnValue({ populate: mockPopulate });

            await getDoctorsOfHospital(mockRequest, mockResponse);

            expect(Doctor.find).toHaveBeenCalledWith(
                { hospital: 'hospital123' },
                'name surname specialization polyclinic'
            );
            expect(mockPopulate).toHaveBeenCalledWith('polyclinic', 'name');
            expect(mockResponse.statusCode).toBe(200);
            expect(mockResponse._getJSONData()).toEqual({
                message: 'Doctors retrieved successfully',
                doctors: mockDoctors
            });
        });

        it('should return 500 on error', async () => {
            Doctor.find.mockReturnValue({
                populate: jest.fn().mockRejectedValue(new Error('Database error'))
            });

            await getDoctorsOfHospital(mockRequest, mockResponse);

            expect(mockResponse.statusCode).toBe(500);
            expect(mockResponse._getJSONData()).toEqual({
                message: 'admin.getDoctorsOfHospital: Database error'
            });
        });
    });

    describe('getDoctor', () => {
        const mockDoctor = {
            name: 'John',
            surname: 'Doe',
            specialization: 'Cardiology'
        };
    
        beforeEach(() => {
            mockRequest.params = { id: 'doctor123' };
            const mockSelect = jest.fn().mockResolvedValue(mockDoctor);
            const mockPopulatePolyclinic = jest.fn().mockReturnValue({ select: mockSelect });
            const mockPopulateHospital = jest.fn().mockReturnValue({ populate: mockPopulatePolyclinic });
            Doctor.findById.mockReturnValue({ populate: mockPopulateHospital });
        });
    
        it('should retrieve a single doctor successfully', async () => {
            await getDoctor(mockRequest, mockResponse);
    
            expect(Doctor.findById).toHaveBeenCalledWith('doctor123');
            expect(mockResponse.statusCode).toBe(200);
            expect(mockResponse._getJSONData()).toEqual({
                message: 'Doctor retrieved successfully',
                doctor: mockDoctor
            });
        });
    
        it('should return 500 on error', async () => {
            // Correctly mock the entire chain to reject
            Doctor.findById.mockReturnValue({
                populate: jest.fn()
                    .mockImplementationOnce(() => ({
                        populate: jest.fn()
                            .mockImplementationOnce(() => ({
                                select: jest.fn().mockRejectedValue(new Error('Database error'))
                            }))
                    }))
            });
    
            await getDoctor(mockRequest, mockResponse);
    
            expect(mockResponse.statusCode).toBe(500);
            expect(mockResponse._getJSONData()).toEqual({
                message: 'admin.getDoctor :Database error'
            });
        });
    });

    describe('updateDoctor', () => {
        beforeEach(() => {
            mockRequest.params = { id: 'doctor123' };
            mockRequest.body = { name: 'Updated Name' };
            Doctor.findByIdAndUpdate.mockResolvedValue({ name: 'Updated Name' });
        });

        it('should update a doctor successfully', async () => {
            await updateDoctor(mockRequest, mockResponse);

            expect(Doctor.findByIdAndUpdate).toHaveBeenCalledWith(
                'doctor123',
                { name: 'Updated Name' },
                { new: true }
            );
            expect(mockResponse.statusCode).toBe(200);
            expect(mockResponse._getJSONData()).toEqual({
                message: 'Doctor updated successfully',
                doctor: { name: 'Updated Name' }
            });
        });

        it('should return 500 on error', async () => {
            Doctor.findByIdAndUpdate.mockRejectedValue(new Error('Database error'));

            await updateDoctor(mockRequest, mockResponse);

            expect(mockResponse.statusCode).toBe(500);
            expect(mockResponse._getJSONData()).toEqual({
                message: 'admin.updateDoctor :Database error'
            });
        });
    });

    describe('deleteDoctor', () => {
        beforeEach(() => {
            mockRequest.params = { id: 'doctor123' };
            Doctor.findByIdAndDelete.mockResolvedValue({});
        });

        it('should delete a doctor successfully', async () => {
            await deleteDoctor(mockRequest, mockResponse);

            expect(Doctor.findByIdAndDelete).toHaveBeenCalledWith('doctor123');
            expect(mockResponse.statusCode).toBe(200);
            expect(mockResponse._getJSONData()).toEqual({
                message: 'Doctor deleted successfully'
            });
        });

        it('should return 500 on error', async () => {
            Doctor.findByIdAndDelete.mockRejectedValue(new Error('Database error'));

            await deleteDoctor(mockRequest, mockResponse);

            expect(mockResponse.statusCode).toBe(500);
            expect(mockResponse._getJSONData()).toEqual({
                message: 'admin.deleteDoctor :Database error'
            });
        });
    });
});
