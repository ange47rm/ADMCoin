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
        newBlock.previousHash = this.getLatestBlock().hash;     // Get the has of the previous block.
        newBlock.hash = newBlock.calculateHash();               // Calculate hash for new block.
        this.chain.push(newBlock);
    }
}

let admCoin = new Blockchain();
admCoin.addBlock(new Block(1, '08/05/1991', { sender: 'Mario', recipient: 'Luigi', amount: 47}));
admCoin.addBlock(new Block(1, '10/05/1991', { sender: 'Scorpion', recipient: 'Sub-Zero', amount: 74}));

console.log(JSON.stringify(admCoin, null, 4));