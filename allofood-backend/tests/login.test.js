const request = require('supertest');
const app = require('../app');

describe('POST /auth/login', () => {

    it('should return 400 Bad Request if the email is invalid', async () => {
        const loginData = {
            email: "echfaiechafai202/21@gmail.com",
            password: "Echafai@echafai2021"
        };
        const response = await request(app)
            .post('/auth/login')
            .send(loginData)
            .set('Accept', 'application/json');

        expect(response.statusCode).toBe(400);
        expect(response.body.error).toBe("Invalid email or password");
    });

    it('should return 400 Bad Request if the password is invalid', async () => {
        const loginData = {
            email: "echfaiechafai20221@gmail.com",
            password: "Echafasi@echafai2021"
        };

        const response = await request(app)
            .post('/auth/login')
            .send(loginData)
            .set('Accept', 'application/json');

        expect(response.statusCode).toBe(400);
        expect(response.body.error).toBe("Invalid email or password");

    });

});