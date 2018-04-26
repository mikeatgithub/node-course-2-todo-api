const expect  = require('expect');
const request = require('supertest');

const {app}   = require('./../server');
const {Todo}  = require('./../models/todo');

// This is explained in video 74

// This will emty the database
beforeEach((done) => {
    Todo.remove({}).then(() => done());
});

describe('POST /todos', () => {

    it('Should creat a new todo', (done) => {
        let text = 'Test to do text';
        
        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((response) => {
                expect(response.body.text).toBe(text);
            })
            .end((err, response) => {
                if (err) {
                    return done(err);   // finished, print to screen
                }

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((e) => done(e));
            });
    });

    it('Should not create todo with invalid body data', (done) => {
        
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, response) => {
                if (err) {
                    return done(err);   // finished, print to screen
                }

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(0);
                    done();
                }).catch((e) => done(e));
            });
    });
});