import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { mockResponse } from 'jest-mock-req-res';
import generateAccessToken from 'backend/utils/generateJwt.js';

dotenv.config({ path: '../../.env' });

describe('generateAccessToken', () => {
    let originalEnv;

    beforeAll(() => {
        originalEnv = process.env;
        process.env.JWT_SECRET = 'test_secret';
        process.env.JWT_REFRESH_SECRET = 'test_refresh_secret';
    });

    afterAll(() => {
        process.env = originalEnv;
    });

    test('should generate access and refresh tokens and set them as cookies', () => {
        const userId = '1234567890';

        // Mock response object
        const res = mockResponse();

        // Call the utility function
        generateAccessToken(userId, res);

        // Verify cookies
        expect(res.cookie).toHaveBeenCalledWith('accessToken', expect.any(String), {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000, // 15 minutes
        });

        expect(res.cookie).toHaveBeenCalledWith('refreshToken', expect.any(String), {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        // Verify JWT tokens
        const accessToken = res.cookie.mock.calls[0][1];
        const refreshToken = res.cookie.mock.calls[1][1];

        const decodedAccessToken = jwt.verify(accessToken, process.env.JWT_SECRET);
        const decodedRefreshToken = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        expect(decodedAccessToken.id).toBe(userId);
        expect(decodedRefreshToken.id).toBe(userId);
    });

    test('should throw an error if JWT_SECRET or JWT_REFRESH_SECRET is missing', () => {
        const userId = '1234567890';

        // Temporarily remove secrets
        delete process.env.JWT_SECRET;
        delete process.env.JWT_REFRESH_SECRET;

        const res = mockResponse();

        expect(() => generateAccessToken(userId, res)).toThrow();

        // Restore secrets
        process.env.JWT_SECRET = 'test_secret';
        process.env.JWT_REFRESH_SECRET = 'test_refresh_secret';
    });
});
