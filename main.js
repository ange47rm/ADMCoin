const SHA256 = require('crypto-js/sha256');

class Block {

    // Index: where the block sits on the chain
    // Timestamp: when the block was created
    // Data: any type of data (for currency it could be transaction details: money sent, sender, recipient)
    // PreviousHash: hash of the previous block 
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }

    calculateHash() {
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
    }
}

class Blockchain {

    constructor() {
        this.chain = [this.createGenesisBlock()];
    }

    // The first block (Genesis block) must be created manually
    createGenesisBlock() {
        return new Block(0, '17/03/2022', "Genesis Block", "N/A");
    }

    getLatestBlock() {
        return this.chain[this.chain.length -1];
    }

    addBlock (newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }
    
    // After a block is added it cannot be changed without invalidating the rest of the chain. 
    // Here we put some checks in place to verify the validity of the blockchain.
    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }
        return true;
    }
}

// TODO
// Implement a mechanism to rollback to a valid state, if the blockchain becomes invalid
// This can happen when adding a new block the wrong way potentially / adding a new block / tampering with existing block data.

let admCoin = new Blockchain();
admCoin.addBlock(new Block(1, '08/05/1991', { sender: 'Mario', recipient: 'Luigi', amount: 47}));
admCoin.addBlock(new Block(2, '10/05/1991', { sender: 'Scorpion', recipient: 'Sub-Zero', amount: 74}));

// TESTS
console.log(JSON.stringify(admCoin, null, 4));

// Verify blockchain validity.
console.log('Is blockchain valid? ', admCoin.isChainValid());

// Tamper with block #1 by changing data in one block.
console.log("Changed block #1's data and recalculated hash.");
admCoin.chain[1].data = { sender: 'Scorpion', recipient: 'Sub-Zero', amount: 1074};
admCoin.chain[1].hash = admCoin.chain[1].calculateHash();
// Block 2 will have a previousHash value that'll be different from the recalculated one. 

// Verify blockchain validity.
console.log('Is blockchain valid? ', admCoin.isChainValid());

