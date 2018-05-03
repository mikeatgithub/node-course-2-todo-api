const bcryptjs = require('bcryptjs');

const password = '123abc';
const password1 = '123abcd';

// bcryptjs.genSalt(10, (err, salt) => {
//     bcryptjs.hash(password, salt, (err, hash) => {
//         console.log('\n',hash, '\n');
//     });
// });

const hashedPassword = '$2a$10$yTVjL0lzjeoTzBqVWqgoGeb8yY.aDg06iH6wUDTyR6ulI0yre9t6m';
bcryptjs.compare(password, hashedPassword, (err, result) => {
    console.log(result);
});

// const jwt      = require('jsonwebtoken');
// const {SHA256} = require('crypto-js');

// let data = {id: 10}
// let salt = '123abc';
// let token = jwt.sign(data, salt);
// console.log(token);

// let decode = jwt.verify(token, salt);
// console.log('decode: ', decode);


// let message = 'I am user 3';
// let hash    = SHA256(message).toString();

// console.log(`Message: ${message}`);
// console.log(`Hash: ${hash}`);

// let data = {
//     id: 4
// };

// let token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + 'someSecretSalt').toString()
// };

// // token.data.id = 5;
// // token.hash = SHA256(JSON.stringify(token.data)).toString();

// let resultHash = SHA256(JSON.stringify(token.data) + 'someSecretSalt').toString();
// if (resultHash === token.hash) {
//     console.log('Data is GOOD and it was not changed.');
// } else {
//     console.log('Data is BAD and it was changed.');
// }
