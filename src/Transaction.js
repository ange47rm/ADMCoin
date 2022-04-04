const SHA256 = require('crypto-js/sha256');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

class Transaction {

    constructor(fromAddress, toAddress, amount) {
        // In the real world, addresses are the public keys of cryptocurrency wallets
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }

    calculateTransactionHash() {
        return SHA256(this.fromAddress + this.toAddress + this.amount).toString();
    }

    signTransaction(signingKey) {
        // The fromAddress of the transaction has to be equal to the public key.
        if (signingKey.getPublic('hex') !== this.fromAddress) {
            throw new Error('You cannot sign transaction for other wallets!');
        }

        const transactionHash = this.calculateTransactionHash();
        const signature = signingKey.sign(transactionHash, 'base64');
        this.signature = signature.toDER('hex');
    }

    isTransactionValid() {
        if (this.fromAddress === null) return true;                                     // for mining rewards transactions (that are never signed).

        if(!this.signature || this.signature.length === 0){
            throw new Error('No signature in this transaction!')
        }

        const publicKey = ec.keyFromPublic(this.fromAddress, 'hex');                    // Extract public key from the transaction's signature.
        return publicKey.verify(this.calculateTransactionHash(), this.signature);       // Verify that the transaction has been signed by that public key.
    }
}

module.exports.Transaction = Transaction;