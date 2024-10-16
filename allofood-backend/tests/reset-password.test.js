const request = require('supertest');
const app = require('../app');

describe('AuthController', () => {
    describe('POST /auth/forgot-password', () => {
        it('should return 400 if the email is not valid', async () => {

            const response = await request(app)
                .post('/auth/forgot-password')
                .send({ email: "nonexistentExample.com" })
                .set('Accept', 'application/json');

            expect(response.statusCode).toBe(400);
            expect(response.body).toHaveProperty('error', 'Please enter a valid email address');
        });
    });

    describe('POST /auth/reset-password/:token', () => {
        it ('should return 400 if the token is invalid', async () => {
            const response = await request(app)
                .post('/auth/reset-password/invalidToken')
                .send({ password: 'Password123', confirmPassword: 'Password123' })
                .set('Accept', 'application/json');
            
            expect(response.statusCode).toBe(400);
            expect(response.body).toHaveProperty('error');
        });

        it('should return 400 if the password is missing', async () => {
            const token = 'validToken';
            const response = await request(app)
                .post(`/auth/reset-password/${token}`)
                .send({ confirmPassword: 'password' })
                .set('Accept', 'application/json');
            
            expect(response.statusCode).toBe(400);
            expect(response.body).toHaveProperty('error');
        });

        it('should return 400 if the confirmPassword is missing', async () => {
            const token = 'validToken';
            const response = await request(app)
                .post(`/auth/reset-password/${token}`)
                .send({ password: 'password' })
                .set('Accept', 'application/json');

            expect(response.statusCode).toBe(400);
            expect(response.body).toHaveProperty('error');
        });

        it('should return 400 if the password is invalid', async () => {
            const token = 'validToken';
            const response = await request(app)
                .post(`/auth/reset-password/${token}`)
                .send({ password: 'short', confirmPassword: 'short' })
                .set('Accept', 'application/json');
    
            expect(response.statusCode).toBe(400);
            expect(response.body).toHaveProperty('error');
        });

        it('should return 400 if the password and confirmPassword do not match', async () => {
            const token = 'validToken';
            const response = await request(app)
                .post(`/auth/reset-password/${token}`)
                .send({ password: 'Password123', confirmPassword: 'Password1234' })
                .set('Accept', 'application/json');

            expect(response.statusCode).toBe(400);
            expect(response.body).toHaveProperty('error');
        });
    });
});