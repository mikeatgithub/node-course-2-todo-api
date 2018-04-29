const env = process.env.NODE_ENV || 'development';
console.log(`\nenv ====>>> ${env}\n`);

if (env === 'development') {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
} else if (env === 'test') {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
}

const _ = require('lodash');
const express    = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');


const {mongoose} = require('./db/mongoose');
const {Todo}     = require('./models/todo');
const {User}     = require('./models/user');

const app = express();
// const port = process.env.PORT || 3000;   // For Heroku hosting port 
const port = process.env.PORT;              // Port is set abouve now

app.use(bodyParser.json());

app.post('/todos', (request, response) => {
    console.log(request.body);
    // return;

    var todo = new Todo({ text: request.body.text });

    todo.save().then((doc) => {
        response.send(doc);
    }, (e) => {
        response.status(400).send(e);
    });
});

app.get('/todos', (request, response) => {
    Todo.find().then((todos) => {
        response.send({todos});
    }, (e) => {
        response.status(400).send(e);
    });
});

// GET /todos/12345
app.get('/todos/:id', (request, response) => {
    let id = request.params.id;

    if (!ObjectID.isValid(id)) {
        return response.status(404).send(); // send no error to browser
    }

    Todo.findById(id).then((todo) => {
        if (!todo) {
            return response.status(404).send();
        }

        // We found the id:
        response.send({todo});
    }).catch((e) => {
        response.status(400).send();
    })

});

app.delete('/todos/:id', (request, response) => {
    // get the id
    let id = request.params.id;

    // Validate the id
    if (!ObjectID.isValid(id)) {
        return response.status(404).send();
    }

    Todo.findByIdAndRemove(id).then((todo) => {
        // If doc was not found then say so to the user
        if (!todo) {
            return response.status(404).send();
        }

        // If we get here then doc was found and
        // it was removed. Say that to the user.
        response.send({todo});

    })
    // Now catch any possible errors.
    .catch((e) => {
        response.status(400).send();
    });
});

// Patch or update todos
app.patch('/todos/:id', (request, response) => {

    let id = request.params.id;

    // Create a body object with the subset of 
    // the request.body. We don't want to allow the
    // user to change anything they want.
    let body = _.pick(request.body, ['text', 'completed']);

    // Validate the id
    if (!ObjectID.isValid(id)) {
        return response.status(404).send();
    }

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();        // # of ms from 1-1-1970
    } else {
        body.completed   = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, {$set: body}, {new: true})
        .then((todo) => {
            if (!todo) {
                return response.status(404).send();
            }
            response.send({todo});
        })
        .catch((e) => {
            response.status(400).send();
        });
});

app.listen(port, () => {console.log(`Server listening on port ${port}...\n`);});

module.exports = {app};
