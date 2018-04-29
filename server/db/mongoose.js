const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI);

// The two below lines are equal
// module.exports = {mongoose: mongoose}
module.exports = {mongoose};

