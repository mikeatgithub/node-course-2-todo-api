// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return (console.log('Unable to connect to MongoDB server.'));
    }

    // If we get her that means we are connected to the DB.
    console.log('Connected to MongoDB server');

    // db.collection('Todos').findOneAndUpdate({
    //     _id: new ObjectID('5ae031aed45262d1f24c8bc2')   // filter argument
    // }, {
    //     $set: {completed: true}     // using $set update operator as second arg
    // }, {
    //     returnOriginal: false       // we need to return updated document not the original dco
    // }).then((result) => {
    //     console.log(result);
    // });

    // 5adf275cdcebe41f285699b7
    db.collection('Users').findOneAndUpdate({
        _id: new ObjectID('5adf275cdcebe41f285699b7')   // filter argument
    }, {
        $set: {name: 'Morrey'},     // using $set update operator as second arg
        $inc: {age: 1}
    }, {
        returnOriginal: false       // we need to return updated document not the original dco
    }).then((result) => {
        console.log(result);
    });

    // db.close();
});