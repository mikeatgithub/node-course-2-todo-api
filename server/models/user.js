const mongoose  = require('mongoose');
const validator = require('validator');
const jwt       = require('jsonwebtoken');
const _         = require('lodash');
const bcryptjs  = require('bcryptjs');


let UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true,
        validate: {
            // validator: (value) => {
            //     return validator.isEmail(value);
            // },
            validator: validator.isEmail,           // This line is the same as above
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

UserSchema.methods.toJSON = function () {
    let user   = this;
    let userObject =user.toObject();

    return _.pick(userObject, ['_id', 'email']);
}

UserSchema.methods.generateAuthToken = function () {
    let user   = this;
    let access = 'auth';
    let salt   = '123abc';
    
    let token  = jwt.sign({
        _id:user._id.toHexString(),
        access
    }, salt).toString();

    // user.tokens.push({access, token});
    user.tokens = user.tokens.concat([{access, token}]); // the same as above

    return user.save().then(() => {return token});
}

UserSchema.statics.findByToken = function (token) {
    let salt = '123abc';
    let User = this;
    let decodedData = undefined;

    try {
        decodedData = jwt.verify(token, salt);
    } catch (error) {
        // return new Promise((resolve, reject) => {
        //     reject();
        // });

        // The same as above except much easier
        return Promise.reject();
    }

    // We will return a promise to be chained in the calling routine
    return User.findOne({
        '_id':           decodedData._id,
        'tokens.token':  token, // tokens is the tokens array defined above
        'tokens.access': 'auth' // quotes are needed because we a dot in the moddle
    });
}

UserSchema.pre('save', function (next) {
    let user = this;

    if (user.isModified('password')) {
        bcryptjs.genSalt(10, (err, salt) => {
            bcryptjs.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

let User = mongoose.model('User', UserSchema);

module.exports = { User };

