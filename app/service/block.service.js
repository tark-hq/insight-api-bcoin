const Utils = require('../util/utils');

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
        const hashBuffer = await this.node.chain.getHash(blockHeight);

        if (hashBuffer) {
            return Utils.bufferToStr(hashBuffer)
        }

        return hashBuffer;
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
        const blockHashBuffer = Utils.strToBuffer(blockHash);
        return await this.node.chain.getEntry(blockHashBuffer)
    }

    /**
     * @param blockHash {string} hash of the block
     * @return {Promise<string>} hash of the next block
     */
    async getNextHash(blockHash) {
        const blockHashBuffer = Utils.strToBuffer(blockHash);
        const nextHash = await this.node.chain.getNextHash(blockHashBuffer);

        if (nextHash) {
            return Utils.bufferToStr(nextHash);
        }

        return nextHash;
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

    async getBlocksByTimestamp(startTimestamp, endTimestamp) {

        const blocks = await this.node.getBlocksByTimestamp(startTimestamp, endTimestamp);

        //populate height
        return await Promise.all(blocks.map(async block => {
            const entry = await this.node.chain.getEntry(block.hash());
            block.height = entry.height;
            return block;
        }));
    }

}

module.exports = BlockService;