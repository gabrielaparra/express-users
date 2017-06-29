const bcrypt = require('bcrypt');

//to encrypt the string 'swordfish'
const salt1 = bcrypt.genSaltSync(10);
// 10 is a balanced number between having a good level of encryption
// and not taking too long in the encryption process.
const encryptedPass1 = bcrypt.hashSync('swordfish', salt1);

console.log('salt1 -> ' + salt1);
//'salt' is extra work done to make a better encryption

console.log('swordfish -> ' + encryptedPass1);

const salt2 = bcrypt.genSaltSync(10);
const encryptedPass2 = bcrypt.hashSync('blah', salt2);

console.log('salt2 -> ' + salt2);
console.log('swordfish -> ' + encryptedPass2);
