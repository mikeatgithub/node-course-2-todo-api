const express    = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');


const {mongoose} = require('./db/mongoose');
const {Todo}     = require('./models/todo');
const {User}     = require('./models/user');

const app = express();

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
            response.status(404).send();
        }

        // We found the id:
        response.send({todo});
    }).catch((e) => {
        response.status(400).send();
    })

});

app.listen(3000, () => {console.log('Server listening on port 3000...\n');});

module.exports = {app};
