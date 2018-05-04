const expect  = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app}   = require('./../server');
const {Todo}  = require('./../models/todo');
const {User}  = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

// This is explained in video 74 and on

// This will emty the database and the
// above array of objects.
beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {

    it('Should create a new todo', (done) => {
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

describe('DELETE /todos/:id', () => {

    it('Should remove a todo', (done) => {
        let hexId = todos[1]._id.toHexString();

        request(app)
            .delete(`/todos/${hexId}`)
            .expect(200)
            .expect((response) => {
                expect(response.body.todo._id).toBe(hexId);
            })
            .end((err, response) => {
                if (err) {
                    return done(err);  // Mocha renders error here
                }

                Todo.findById(hexId).then((todo) => {
                    expect(todo).toNotExist();
                    done();
                }).catch((e) => done(e));
            });
    });

    it('Should return a 404 if not found', (done) => {
        // id = new ObjectID();
        request(app)
            // Create a new object ID
            .delete(`/todos/${new ObjectID().toHexString()}`)
            .expect(404)
            .end(done);

    });

    it('Should return a 404 if object id is invalid', (done) => {
        request(app)
            .delete(`/todos/123abc`)   // 123abc is non-object object id
            .expect(404)
            .end(done);
    });
});

describe('PATCH /todos/:id', () => {
    it('Should update the todo', (done) => {
        let hexId = todos[0]._id.toHexString();
        let text = 'This should be the new text.';

        request(app)
            .patch(`/todos/${hexId}`)
            .send({
                completed: true,
                text                
            })
            .expect(200)
            .expect((response) => {
                expect(response.body.todo.text).toBe(text);
                expect(response.body.todo.completed).toBe(true);
                expect(response.body.todo.completedAt).toBeA('number');
            })
            .end(done);
    });

    it('Should clear completedAt when todo is not completed.', (done) => {
        let hexId = todos[1]._id.toHexString();
        let text = 'This should be the new text!!!!';

        request(app)
            .patch(`/todos/${hexId}`)
            .send({
                completed: false,
                text                
            })
            .expect(200)
            .expect((response) => {
                expect(response.body.todo.text).toBe(text);
                expect(response.body.todo.completed).toBe(false);
                expect(response.body.todo.completedAt).toNotExist();
            })
            .end(done);
    });
    
});

describe('GET /users/me', () => {
    it('Should return user if authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)    // Set the header
            .expect(200)
            .expect((response) => {
                expect(response.body._id).toBe(users[0]._id.toHexString());
                expect(response.body.email).toBe(users[0].email);
            })
            .end(done);
    });

    it('Should return 401 if not authenticated', (done) => {
        request(app)
            .get('/users/me')
            .expect(401)        
            .expect((response) => {
                expect(response.body).toEqual({});
            })        
            .end(done);
    });
});

describe('POST /users', () => {
    it('Should create a user', (done) => {
        let email = 'example@example.com';
        let password = '123mnb!';

        request(app)
            .post('/users')
            .send({email, password})
            .expect(200)
            .expect((response) => {
                expect(response.headers['x-auth']).toExist();
                expect(response.body._id).toExist();
                expect(response.body.email).toBe(email);
            })
            .end((err) => {
                if (err) {
                    return done(err);
                }

                User.findOne({email}).then((user) => {
                    expect(user).toExist();
                    expect(user.password).toNotBe(password);
                    done();
                }).catch((e) => done(e));
            });
    });

    it('Should return validation errors if invalid', (done) => {
        request(app)
            .post('/users')
            .send({email: 'badEmail@noSite', password: '2few'})
            .expect(400)
            .end(done);
    });

    it('Should not create user if email is in use in our DB', (done) => {
        request(app)
            .post('/users')
            .send({email: users[0].email, password: 'goodPassword'})
            .expect(400)
            .end(done);            
    });
});

describe('POST /users/login', () => {
    it('Should login user and return token', (done) => {
        request(app)
            .post('/users/login')
            .send({email: users[1].email, password: users[1].password})
            .expect(200)
            .expect((response) => {
                // Cannot use headers.x-auth form.
                // Must use headers[x-auth] because of the dash in the name
                expect(response.headers['x-auth']).toExist();
            })
            .end((err, response) => {
                if (err) {
                    return done(err);
                }

                User.findById(users[1]._id).then((user) => {
                    expect(user.tokens[0]).toInclude({
                        access: 'auth',
                        token: response.headers['x-auth']
                    });
                    done();
                }).catch((e) => done(e));
            });
    });

    it('Should reject invalid login', (done) => {
        request(app)
        .post('/users/login')
        .send({
            email: users[1].email,
            password: users[1].password + 'screw up the password to fail the test'
        })
        .expect(400)
        .expect((response) => {
            // Cannot use headers.x-auth form.
            // Must use headers[x-auth] because of the dash in the name
            expect(response.headers['x-auth']).toNotExist();
        })
        .end((err, response) => {
            if (err) {
                return done(err);
            }

            User.findById(users[1]._id).then((user) => {
                expect(user.tokens.length).toBe(0);
                done();
            }).catch((e) => done(e));
        });
    });
});

describe('DELETE /users/me/token', () => {
    it('Should remove auth token on logout', (done) => {
        request(app)
            .delete('/users/me/token')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .end((err, response) => {
                if (err) {
                    return done(err);
                }

                User.findById(users[0]._id).then((user) => {
                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch((e) => done(e));
            })
    });
});
