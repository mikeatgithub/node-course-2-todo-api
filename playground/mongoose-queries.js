const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo}     = require('./../server/models/todo');
const {User}     = require('./../server/models/user');

// Todo.find({
//     // Using mongoose there is no need to
//     // convert like this: _id: new ObjectID('5adf242123be0d2602464166')
//     // Mongoose will do the conversion.
//     _id: id
// }).then((todos) => {
//     console.log('Todos', todos);
// });

// Todo.findOne({
//     _id: id
// }).then((todo) => {
//     console.log('Todo', todo);
// });

// Todo.findById(id).then((todo) => {
//     if (!todo) {
//         return console.log('Id not found.');
//     }
//     console.log('Todo By Id', todo);
// }).catch((e) => console.log(e));

const userId = '5ae04a384ae662441811e924';

if (!ObjectID.isValid(userId)) {
    console.log('Invalid user is: ', userId);
    return
} else {
    User.findById(userId).then((user) => {
        if (!user) {
            return console.log('User ID not found.');
        }

        console.log('User by ID:', JSON.stringify(user, undefined, 2));
    }, (e) => {
        console.log('Error ======> ', e);
    }).catch((e) => console.log('Error +++++++ >>>> ', e));
};