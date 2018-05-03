const {User} = require('./../models/user');

const authenticate = (request, response, next) => {
    let token = request.header('x-auth');

    User.findByToken(token).then((user) => {
        if (!user) {
            // response.status(401).send();

            // if this line runs then we will jump to catch line below: }).catch((e) => {
            return Promise.reject();
        }

        request.user = user;
        request.token = token;
        next();     // We must call next() so that "app.get('/users/me', authenticate, ..." arrow function can execute
    }).catch((e) => {
        response.status(401).send();
    });
};

module.exports = {authenticate};
