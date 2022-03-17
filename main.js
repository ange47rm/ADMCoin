const SHA256 = require('crypto-js/sha256');

class Block {

    // Index: where the block sits on the chain
    // Timestamp: when the block was created
    // Data: any type of data (for currency it could be transaction details: money sent, sender, recipient)
    // PreviousHash: hash of the previous block 
    // Nonce: Same properties within the block, will generate the same hash. When mining a new block, the nonce number allows the calculated hash value to always be different as it increases.
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
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
}

// Potential issue: if data in a block is changed, hashes of all blocks could be recalculated and the blockchain would be valid.
// Proof-of-work/mining can prevent that from happening by delaying the calculation of blocks' hash values, implementing a "difficulty" value.
class Blockchain {

    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 5;    // Determines how "difficult"/fast new block can be added to the blockchain.
    }

    // The first block (Genesis block) must be created manually
    createGenesisBlock() {
        return new Block(0, '17/03/2022', "Genesis Block", "N/A");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty);
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

    getNewBlockIndex() {
        return this.chain.length;
    }
}

// TODO
// Implement a mechanism to rollback to a valid state, if the blockchain becomes invalid
// This can happen when adding a new block the wrong way potentially / adding a new block / tampering with existing block data.


let admCoin = new Blockchain();

console.log(JSON.stringify(admCoin, null, 4));

console.log(`Mining block #${admCoin.getNewBlockIndex()}`);
admCoin.addBlock(new Block(admCoin.getNewBlockIndex(), '08/05/1991', { sender: 'Mario', recipient: 'Luigi', amount: 47 }));

console.log(`Mining block #${admCoin.getNewBlockIndex()}`);
admCoin.addBlock(new Block(admCoin.getNewBlockIndex(), '10/05/1991', { sender: 'Scorpion', recipient: 'Sub-Zero', amount: 74 }));

// TESTS
console.log(JSON.stringify(admCoin, null, 4));

// // Verify blockchain validity.
// console.log('Is blockchain valid? ', admCoin.isChainValid());

// // Tamper with block #1 by changing data in one block.
// console.log("Changed block #1's data and recalculated hash.");
// admCoin.chain[1].data = { sender: 'Scorpion', recipient: 'Sub-Zero', amount: 1074};
// admCoin.chain[1].hash = admCoin.chain[1].calculateHash();
// // Block 2 will have a previousHash value that'll be different from the recalculated one.

// // Verify blockchain validity.
// console.log('Is blockchain valid? ', admCoin.isChainValid());

