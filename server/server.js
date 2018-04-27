const express    = require('express');
const bodyParser = require('body-parser');

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

app.listen(3000, () => {console.log('Server listening on port 3000...\n');});

module.exports = {app};
