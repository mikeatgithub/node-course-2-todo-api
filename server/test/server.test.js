const expect  = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app}   = require('./../server');
const {Todo}  = require('./../models/todo');

const todos = [
    {_id: new ObjectID(), text: 'First test todo'},
    {_id: new ObjectID(), text: 'Second test todo'}
];

// This is explained in video 74 and on

// This will emty the database and the
// above array of objects.
beforeEach((done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
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

                Todo.find({text}).then((todos) => {
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
                    expect(todos.length).toBe(2);
                    done();
                }).catch((e) => done(e));
            });
    });
});

describe('GET /todos', () => {
    it('Should get all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((response) => {
                expect(response.body.todos.length).toBe(2);
            })
            .end(done);
    });
});

describe('Get /todos/:id', () => {
    
    it('Should return todo doc for given id', (done) => {   // Since async we need done() callback
         request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((response) => {
                expect(response.body.todo.text).toBe(todos[0].text)
            })
            .end(done);
    });

    it('Should return 404 1f todo not found.', (done) => {
        // id = new ObjectID();
        request(app)
            // Create a new object ID
            .get(`/todos/${new ObjectID().toHexString()}`)
            .expect(404)
            .end(done);
    });

    it('Should return 404 for non-object ids', (done) => {
        request(app)
            .get(`/todos/123abc`)   // 123abc is non-object object id
            .expect(404)
            .end(done);
    });
});