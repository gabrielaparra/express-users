const bcrypt = require('bcrypt');

//to encrypt the string 'swordfish'
const salt1 = bcrypt.genSaltSync(10);
const encryptedPass1 = bcrypt.hashSync('swordfish', salt1);

console.log('salt1 -> ')
console.log('swordfish -> ' + encryptedPass1);

const salt2 = bcrypt.genSaltSync(10);
const encryptedPass2 = bcrypt.hashSync('blah', salt2);

console.log('swordfish -> ' + encryptedPass2);
