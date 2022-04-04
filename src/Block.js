const {Transaction} = require ('./Transaction');

const SHA256 = require('crypto-js/sha256');

class Block {

    // Timestamp: when the block was created
    // Transactions: array of transactions
    // PreviousHash: hash of the previous block 
    // Nonce: Same properties within the block, will generate the same hash. When mining a new block, the nonce number allows the calculated hash value to always be different as it increases.
    constructor(timestamp, transactions, previousHash = '') {
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash() {
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    // The below methods defines how much computing power is required to create a new block.
    // If difficulty is set to 5, it means that the loop will run until the hash of the new block begins with 5 '0's and so on.
    mineBlock(difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log('Block mined: ' + this.hash);
    }

    hasValidTransactions(){
        for (const transaction of this.transactions){
            if (!transaction.isTransactionValid()) {
                return false;
            }
        }
        return true;
    }
}

module.exports.Block = Block;