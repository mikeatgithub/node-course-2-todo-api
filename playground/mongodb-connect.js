const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return (console.log('Unable to connect to MongoDB server.'));
    }

    // If we get her that means we are connected to the DB.
    console.log('Connected to MongoDB server');
    
    // db.collection('Todos').insertOne({
    //     text: 'Something to do',
    //     completed: false
    // }, (err, result) => {
    //     if (err) {
    //         return (console.log('Unable to insert todo.', err));
    //     }
        
    //     // If we get here we succefully inserted the record.
    //     console.log(JSON.stringify(result.ops, undefined, 2));
    // });

    db.collection('Users').insertOne({
        name: 'Mike. M',
        age: 29,
        location: 'Baguio'
    }, (err, result) => {
        if (err) {
            return (console.log('Unable to insert user.', err));
        }
        
        // If we get here we succefully inserted the record.
        console.log(JSON.stringify(result.ops, undefined, 2));
    });

    db.close();
});

