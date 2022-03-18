const SHA256 = require('crypto-js/sha256');

class Transacton {

    constructor(fromAddress, toAddress, amount) {
        // In the real world, addresses are the public keys of cryptocurrency wallets
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}

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
}

// Potential issue: if data in a block is changed, hashes of all blocks could be recalculated and the blockchain would be valid.
// Proof-of-work/mining can prevent that from happening by delaying the calculation of blocks' hash values, implementing a "difficulty" value.
// Bitcoin uses PoW to ensure only one block is created every 10 minutes.
class Blockchain {

    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;            // Determines how "difficult"/fast new block can be added to the blockchain.
        this.pendingTransactions = [];  // As blocks are mined one at a time, every X minutes, pending transactions are stored here.
        this.miningReward = 100;        // Coin reward if a new block is successfully mined.
    }

    // The first block (Genesis block) must be created manually
    createGenesisBlock() {
        return new Block('17/03/2022', "Genesis Block", "N/A");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    // addBlock(newBlock) {
    //     newBlock.previousHash = this.getLatestBlock().hash;
    //     newBlock.mineBlock(this.difficulty);
    //     this.chain.push(newBlock);
    // }

    minePendingTransactions(miningRewardAddress) {
        // Mines a block and stores transactions to the blockchain.
        let block = new Block(Date.now(), this.pendingTransactions); // Realistically, as there are so many pending transactions, miners can which transaction to include. They're not all processed as we're doing here.
        block.mineBlock(this.difficulty);
        console.log('Block successfully mined!');
        this.chain.push(block);
        this.pendingTransactions = [new Transacton(null, miningRewardAddress, this.miningReward)]; // The mining reward is sent only after the next block is mined, not after each block.
    }

    createTransaction(transaction) {
        this.pendingTransactions.push(transaction);
    }

    getAddressBalance(address) {
        let balance = 0;
        for (const block of this.chain) {
            for (const trans of block.transactions) {
                if (trans.fromAddress === address) {
                    balance -= trans.amount;
                }
                if (trans.toAddress === address) {
                    balance += trans.amount;
                }
            }
        }
        return balance;
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

admCoin.createTransaction(new Transacton('address1', 'address2', 200));
admCoin.createTransaction(new Transacton('address2', 'address1', 40));
// These transactions are added to the pending transactions array of the blockchain.

console.log('\nStarting the miner...');
admCoin.minePendingTransactions('angelos-address');

console.log('\nBalance of Angelo is', admCoin.getAddressBalance('angelos-address'));

console.log('\nStarting the miner again...');
admCoin.minePendingTransactions('angelos-address');

console.log('\nBalance of Angelo is', admCoin.getAddressBalance('angelos-address'));
