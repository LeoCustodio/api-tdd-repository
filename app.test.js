const request = require('supertest');
const app = require('./app');


describe('ToDos', () => {
     beforeEach(async () => {
        await request(app).post('/__reset'); //reset for each test
    });

    it('GET /todos --> array todos', async () => {
        const res = await request(app).get('/todos')
        .expect('Content-Type', /json/)
        .expect(200);

        // /todos returns a paginated shape, check items array
        expect(res.body.items).toEqual(
        expect.arrayContaining([
            expect.objectContaining({
            id: expect.any(Number),
            name: expect.any(String),
            completed: expect.any(Boolean),
            }),
        ])
        );
    });

    it('GET /todos --> array todos', () => {
        return request(app)
            .get('/todos')
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
                expect(response.body).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({
                            id: expect.any(Number),
                            name: expect.any(String),
                            completed: expect.any(Boolean),
                        }),
                    ])
                );
            });
    });

    it('GET /todos/id --> specific todo by id', () => {
        return request(app)
            .get('/todos/1')
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
                expect(response.body).toEqual(
                    expect.objectContaining({
                        name: expect.any(String),
                        completed: expect.any(Boolean),
                    })
                );
            });
    });

    it('GET /todos/id --> 404 if not found', () => {
        return request(app).get('/todos/1111111').expect(404);
    });

    it('POST /todos --> create todo', () => {
        return request(app)
            .post('/todos')
            .send({
                name: 'do laundry'
            })
            .expect('Content-Type', /json/)
            .expect(201)
            .then((response) => {
                expect(response.body).toEqual(
                    expect.objectContaining({
                        name: 'do laundry',
                        completed: false,
                    }),
                );
            });
    });

    it('POST /todos --> validates request body', () => {
        return request(app)
            .post('/todos')
            .send({
                name: 123
            })
            .expect(422);
    });

    it('DELETE /todos/id --> delete todo by id', () => {
        return request(app)
            .delete('/todos/1')
            .expect(204);
    });
})
