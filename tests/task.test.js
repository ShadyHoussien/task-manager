const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/models/tasks')
const { userOneId, userOne,userTwo, setupDatabase, taskOne } = require('./fixtures/db')

beforeEach(setupDatabase)


test('Should create task for user', async () => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: 'From my test'
        })
        .expect(201)
    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.isCompleted).toEqual(false)
})

test('Should get tasks of user', async () => {
    var response = await request(app).get('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);
    expect(response.body.length).toBe(2);
})

test('Should not delete for unauthenticated user', async () => {
    await request(app).get(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(404);

     const task = await Task.findById(taskOne._id);
     expect(task).not.toBeNull()   
})