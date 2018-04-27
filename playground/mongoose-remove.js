const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo}     = require('./../server/models/todo');
const {User}     = require('./../server/models/user');

// Todo.remove().then((result) => {
//     console.log(result);
// });

// 5ae33086f2dd700a3624d7eb

// Todo.findOneAndRemove
// Todo.findByIdAndRemove

Todo.findOneAndRemove({_id: '5ae331e7f2dd700a3624d827'}).then((todo) => {
    console.log(todo);
});

// Todo.findByIdAndRemove('5ae33086f2dd700a3624d7eb').then((todo) => {
//     console.log(todo);
// });

