// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return (console.log('Unable to connect to MongoDB server.'));
    }

    // If we get her that means we are connected to the DB.
    console.log('Connected to MongoDB server');

    // DeleteMany
    // db.collection('Todos').deleteMany({text: 'Eat lunch'}).then((result) => {
    //     console.log(result);
    // });

    // DeleteOne
    // db.collection('Todos').deleteOne({text: 'Eat lunch'}).then((result) => {
    //     console.log(result);
    // });

    // findOneAndDelete
    db.collection('Todos').findOneAndDelete({
        _id: new ObjectID('5adf242123be0d2602464166')
    }).then((result) => {
        console.log(result);
    });

    // db.close();
});