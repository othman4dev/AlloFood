const request = require('supertest');
const app = require('../app');

describe('POST /auth/verify-otp', () => {

    it('should return 400 if OTP token is missing', async () => {
        const verifyOtpData = {
            otp: '123456'
        };

        const response = await request(app)
            .post('/auth/verify-otp')
            .send(verifyOtpData)
            .set('Accept', 'application/json');

        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('error', 'OTP token is required');
    });

    it('should return 400 if OTP token is invalid or expired', async () => {
        const verifyOtpData = {
            otp: '123456',
            otpToken: 'invalidToken'
        };

        const response = await request(app)
            .post('/auth/verify-otp')
            .send(verifyOtpData)
            .set('Accept', 'application/json');

        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('error', 'Invalid or expired OTP token');
    });

});