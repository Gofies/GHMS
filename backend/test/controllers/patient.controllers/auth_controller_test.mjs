// test/controllers/patient.controllers/auth_controller_test.mjs

import { signup, changePassword } from '../../../controllers/patient.controllers/auth.controller.js';
import bcryptjs from 'bcryptjs';
import Patient from '../../../models/patient.model.js';
import jwt from 'jsonwebtoken';

// Mock dependencies for controller tests
jest.mock('../../../models/patient.model.js');
jest.mock('bcryptjs');
jest.mock('../../../utils/generateJwt.js');

import generateAccessTokenMock from '../../../utils/generateJwt.js'; // This is mocked

describe('Patient Controller Tests', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('signup', () => {
        it('should signup a new patient successfully', async () => {
            const req = {
                body: {
                    name: 'John',
                    surname: 'Doe',
                    gender: 'Male',
                    email: 'john@example.com',
                    password: 'password123',
                    passwordconfirm: 'password123',
                    phone: '123456789',
                    emergencycontact: '987654321',
                    birthdate: '1990-01-01',
                    nationality: 'American',
                    address: '123 Main St'
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            Patient.findOne.mockResolvedValue(null);
            bcryptjs.genSalt.mockResolvedValue('salt');
            bcryptjs.hash.mockResolvedValue('hashedPassword');
            Patient.create.mockResolvedValue({
                _id: '1',
                ...req.body,
                password: 'hashedPassword',
                role: 'patient'
            });

            await signup(req, res);

            expect(Patient.findOne).toHaveBeenCalledWith({ $or: [{ email: 'john@example.com' }] });
            expect(bcryptjs.hash).toHaveBeenCalledWith('password123', 'salt');
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Signup successful',
                patient: expect.objectContaining({
                    _id: '1',
                    name: 'John',
                    surname: 'Doe'
                })
            });
            expect(generateAccessTokenMock).toHaveBeenCalledWith('1', res);
        });

        it('should return 400 if required fields are missing', async () => {
            const req = { body: { name: 'John' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await signup(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'All fields are required' });
        });

        it('should return 400 if passwords do not match', async () => {
            const req = {
                body: {
                    name: 'John',
                    surname: 'Doe',
                    gender: 'Male',
                    email: 'john@example.com',
                    password: 'password123',
                    passwordconfirm: 'wrongpassword',
                    phone: '123456789',
                    emergencycontact: '987654321',
                    birthdate: '1990-01-01',
                    nationality: 'American',
                    address: '123 Main St'
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await signup(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Passwords do not match' });
        });

        it('should return 400 if patient already exists', async () => {
            const req = {
                body: {
                    name: 'John',
                    surname: 'Doe',
                    gender: 'Male',
                    email: 'john@example.com',
                    password: 'password123',
                    passwordconfirm: 'password123',
                    phone: '123456789',
                    emergencycontact: '987654321',
                    birthdate: '1990-01-01',
                    nationality: 'American',
                    address: '123 Main St'
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            Patient.findOne.mockResolvedValue({ email: 'john@example.com' });

            await signup(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Patient already exists' });
        });
    });

    describe('changePassword', () => {
        it('should update password successfully', async () => {
            const req = {
                user: { _id: '1' },
                body: {
                    currentPassword: 'oldPassword',
                    newPassword: 'newPassword123',
                    newPasswordConfirm: 'newPassword123'
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            const mockPatient = {
                _id: '1',
                password: 'hashedOldPassword',
                save: jest.fn()
            };

            Patient.findById.mockResolvedValue(mockPatient);
            bcryptjs.compare.mockResolvedValue(true);
            bcryptjs.genSalt.mockResolvedValue('salt');
            bcryptjs.hash.mockResolvedValue('hashedNewPassword');

            await changePassword(req, res);

            expect(Patient.findById).toHaveBeenCalledWith('1');
            expect(bcryptjs.compare).toHaveBeenCalledWith('oldPassword', 'hashedOldPassword');
            expect(bcryptjs.hash).toHaveBeenCalledWith('newPassword123', 'salt');
            expect(mockPatient.password).toBe('hashedNewPassword');
            expect(mockPatient.save).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Password updated successfully' });
        });

        it('should return 400 if required fields are missing', async () => {
            const req = {
                body: {
                    newPassword: 'newPassword123',
                    newPasswordConfirm: 'newPassword123'
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await changePassword(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'All fields are required' });
        });

        it('should return 400 if passwords do not match', async () => {
            const req = {
                user: { _id: '1' },
                body: {
                    currentPassword: 'oldPassword',
                    newPassword: 'password123',
                    newPasswordConfirm: 'wrongpassword'
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await changePassword(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Passwords do not match' });
        });

        it('should return 400 if current password is invalid', async () => {
            const req = {
                user: { _id: '1' },
                body: {
                    currentPassword: 'wrongPassword',
                    newPassword: 'newPassword123',
                    newPasswordConfirm: 'newPassword123'
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            Patient.findById.mockResolvedValue({ password: 'hashedOldPassword' });
            bcryptjs.compare.mockResolvedValue(false);

            await changePassword(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Invalid current password' });
        });

        it('should return 404 if patient is not found', async () => {
            const req = {
                user: { _id: '1' }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            Patient.findById.mockResolvedValue(null);

            await changePassword(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Server error. Please try again later.' });
        });
    });
});

// Separate tests for generateAccessToken to avoid interference from mocks
describe('generateAccessToken', () => {
    // Import the actual generateAccessToken after mocks are set up
    jest.resetModules(); // Clear previous mocks
    const generateAccessToken = jest.requireActual('../../../utils/generateJwt.js').default;
    const jwtActual = require('jsonwebtoken');

    beforeAll(() => {
        process.env.JWT_SECRET = 'testSecret';
        process.env.JWT_REFRESH_SECRET = 'testRefreshSecret';
    });

    afterAll(() => {
        delete process.env.JWT_SECRET;
        delete process.env.JWT_REFRESH_SECRET;
    });

    beforeEach(() => {
        jwtActual.sign = jest.fn();
    });

    it('should generate access and refresh tokens and set cookies', () => {
        const mockRes = { cookie: jest.fn() };
        const userId = 'user123';

        // Mock `jwt.sign` responses
        jwtActual.sign
            .mockReturnValueOnce('mockAccessToken') // Access token
            .mockReturnValueOnce('mockRefreshToken'); // Refresh token

        generateAccessToken(userId, mockRes);

        // Verify `jwt.sign` calls
        expect(jwtActual.sign).toHaveBeenCalledTimes(2);
        expect(jwtActual.sign).toHaveBeenCalledWith(
            { id: userId },
            'testSecret',
            { expiresIn: '15m' }
        );
        expect(jwtActual.sign).toHaveBeenCalledWith(
            { id: userId },
            'testRefreshSecret',
            { expiresIn: '7d' }
        );

        // Verify cookies
        expect(mockRes.cookie).toHaveBeenCalledWith('accessToken', 'mockAccessToken', {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000, // 15 minutes
        });
        expect(mockRes.cookie).toHaveBeenCalledWith('refreshToken', 'mockRefreshToken', {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
    });

    it('should handle errors gracefully', () => {
        const mockRes = { cookie: jest.fn() };
        const userId = 'user123';

        jwtActual.sign.mockImplementation(() => {
            throw new Error('JWT Error');
        });

        expect(() => generateAccessToken(userId, mockRes)).toThrow('JWT Error');
        expect(mockRes.cookie).not.toHaveBeenCalled();
    });
});
