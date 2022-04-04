// Potential issue: if data in a block is changed, hashes of all blocks could be recalculated and the blockchain would be valid.
// Proof-of-work/mining can prevent that from happening by delaying the calculation of blocks' hash values, implementing a "difficulty" value.

const { Transaction } = require('./Transaction');
const { Block } = require('./Block');

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
        const rewardTransaction = new Transaction(null, miningRewardAddress, this.miningReward); // Mining rewards are not signed but are valid regardless.
        this.pendingTransactions.push(rewardTransaction);

        // Mines a block and stores transactions to the blockchain.
        let block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash); // Realistically, as there are so many pending transactions, miners can which transaction to include. They're not all processed as we're doing here.
        block.mineBlock(this.difficulty);
        console.log('Block successfully mined!');
        this.chain.push(block);
        this.pendingTransactions = [new Transaction(null, miningRewardAddress, this.miningReward)]; // The mining reward is sent only after the next block is mined, not after each block.
    }

    addTransaction(transaction) {
        if (!transaction.fromAddress || !transaction.toAddress) {
            throw new Error('Transaction must include a "from" and "to" address.');
        }

        if (!transaction.isTransactionValid()) {
            throw new Error('Cannot add an invalid transaction to the chain.')
        }
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
    
    // Check if the Genesis block hasn't been tampered with by comparing
    // the output of createGenesisBlock with the first block on our chain
    const realGenesis = JSON.stringify(this.createGenesisBlock());

    if (realGenesis !== JSON.stringify(this.chain[0])) {
      return false;
    }

    // Check the remaining blocks on the chain to see if there hashes and signatures are correct.
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (previousBlock.hash !== currentBlock.previousHash) {
        return false;
      }

      if (!currentBlock.hasValidTransactions()) {
        return false;
      }

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }
    }

    return true;
  }

    getNewBlockIndex() {
        return this.chain.length;
    }
}

module.exports.Blockchain = Blockchain;

// TODO
// Implement a mechanism to rollback to a valid state, if the blockchain becomes invalid
// This can happen when adding a new block the wrong way potentially / adding a new block / tampering with existing block data.