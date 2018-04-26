const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');

// The two below lines are equal
// module.exports = {mongoose: mongoose}
module.exports = {mongoose};

