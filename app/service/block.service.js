const Utils = require('../util/utils')

class BlockService {

    /**
     *
     * @param node {FullNode} bcoin's fullnode
     */
    constructor(node) {
        if (!node) {
            throw new Error("Bcoin {Fullnode} expected as dependency")
        }

        this.node = node;

    }

    /**
     *
     * @param blockHeight {number}
     * @return {Promise<string>} hash
     */
    async getBlockHash(blockHeight) {
        return await this.node.chain.getHash(blockHeight);
    }

    /**
     *
     * @param hash {string} hash of block to get
     * @return {Promise<Block>} block
     */
    async getBlock(hash) {
        const blockHashBuffer = Utils.strToBuffer(hash);
        return await this.node.getBlock(blockHashBuffer);
    }


    /**
     *
     * @param blockHash {string}
     * @return {Promise<ChainEntry>} chain entry
     */
    async getEntry(blockHash) {
        const blockHashBuffer = Utils.strToBuffer(hash);
        return await this.node.chain.getEntry(blockHashBuffer)
    }

    /**
     * @param blockHash {string} hash of the block
     * @return {Promise<string>} hash of the next block
     */
    async getNextHash(blockHash) {
        const blockHashBuffer = Utils.strToBuffer(hash);
        return await this.node.chain.getNextHash(blockHashBuffer);
    }

    /**
     *
     * @return {Promise<number>}
     */
    async getBestBlockHeight() {
        return this.node.chain.height;
    }

    /**
     *
     * @param entry {ChainEntry}
     * @return {Promise<boolean>}
     */
    async isMainChain(entry) {
        return await this.node.chain.isMainChain(entry)
    }

}

module.exports = BlockService;