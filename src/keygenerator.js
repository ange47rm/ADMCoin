const EC = require('elliptic').ec;

// Elliptic is a library used to generate public and private keys. It also comes with methods to sign something and verify a signature.
// Private and public keys are used to verify transactions and verify our balance.

const ec = new EC('secp256k1'); // Secp256k1 is the name of the elliptic curve used by Bitcoin to implement its public key cryptography.

const key = ec.genKeyPair();

const publicKey = key.getPublic('hex'); 

const privateKey = key.getPrivate('hex');

console.log();
console.log('Public Key:', publicKey);
console.log();
console.log('Private Key:', privateKey);

