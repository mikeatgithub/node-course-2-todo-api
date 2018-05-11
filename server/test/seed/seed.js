const {ObjectID} = require('mongodb');
const jwt        = require('jsonwebtoken');

const {Todo}     = require('./../../models/todo');
const {User}     = require('./../../models/user');

const salt = '123abc';
const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [{
    _id     : userOneId,
    email   : 'me@example.com',
    password: 'userOnePass',
    tokens:[{
        access: 'auth',
        token: jwt.sign({_id: userOneId, access: 'auth'}, salt).toString()
    }]
},{
    _id     : userTwoId,
    email   : 'self@example.com',
    password: 'userTwoPass',
    tokens:[{
        access: 'auth',
        token: jwt.sign({_id: userTwoId, access: 'auth'}, salt).toString()
    }]
}
];

const todos = [
    {_id: new ObjectID(), text: 'First test todo',
    _creator: userOneId},
    
    {_id: new ObjectID(), text: 'Second test todo',
    completed: true, completedAt: 333,
    _creator: userTwoId}
];

const populateTodos = (done) => {
    // remove empty object will remove all
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
};

const populateUsers = (done) => {
    // remove empty object will remove all
    User.remove({}).then(() => {
        let userOne = new User(users[0]).save();
        let userTwo = new User(users[1]).save();

        // Wait until all of our promises are resolved
        return Promise.all([userOne, userTwo]);
    }).then(() => done());
};
 
module.exports = {todos, populateTodos, users, populateUsers};
