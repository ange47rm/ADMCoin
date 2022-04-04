const {Blockchain} = require ('./Blockchain');
const {Transaction} = require ('./Transaction');
const {Block} = require ('./Block');

const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

 const myKey = ec.keyFromPrivate('44a50b5d4e0ec3c108e9aaeb626b45b7a32ef495b673a45ed9d8711d7ff4c8d4'); // Private Key
 const myWalletAddress = myKey.getPublic('hex'); // Public Key

let admCoin = new Blockchain();

const transaction1 = new Transaction(myWalletAddress, 'someone elses wallet address', 10);
transaction1.signTransaction(myKey);
admCoin.addTransaction(transaction1);

console.log('\nStarting the miner...');
admCoin.minePendingTransactions(myWalletAddress);

console.log('\nBalance of Angelo is', admCoin.getAddressBalance(myWalletAddress)); // Result is 90. Block mined reward is 100, however 90 were spent in the transaction above.

admCoin.chain[1].transactions[0].amount = 1; // Changes amount of a previous transaction, invalidating the chain.

console.log("Is chain valid?", admCoin.isChainValid());


