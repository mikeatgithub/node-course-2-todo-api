const jwt      = require('jsonwebtoken');
// const {SHA256} = require('crypto-js');

let data = {id: 10}
let token = jwt.sign(data, '123abc');
console.log(token);

let decode = jwt.verify(token, '123abc');
console.log('decode: ', decode);


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
