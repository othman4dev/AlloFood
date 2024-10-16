const request = require('supertest');
const app = require('../app');

describe('POST /auth/register', () => {
    it('should return 400 if the email is not valid', async () => {
        const response = await request(app)
            .post('/auth/register')
            .send({name: 'user', email: "nonValidEmail.com", password: "Password123", confirmPassword: "Password123" })
            .set('Accept', 'application/json');

        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('error');
    });
    
    it('should return 400 if the email is missing', async () => {
        const response = await request(app)
            .post('/auth/register')
            .send({name: 'user', password: "Password123", confirmPassword: "Password123" })
            .set('Accept', 'application/json');

        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('error');
    });

    it('should return 400 if the password is missing', async () => {
        const response = await request(app)
            .post('/auth/register')
            .send({name: 'user', email: "@example.com", confirmPassword: "Password123" })
            .set('Accept', 'application/json');

        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('error');
    });
});