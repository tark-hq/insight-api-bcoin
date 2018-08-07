const ErrorMessage = require('../model/ErrorMessage');

const AddressService = require('../service/address.service');
const BlockService = require('../service/block.service');
const MappingService = require('../service/mapping.service');

const ValidationUtils = require('../util/validation.utils');

class BlockController {

    /**
     *
     * @param node {FullNode} bcoin's full node
     */
    constructor(node) {
        if (!node) {
            throw new Error("Bcoin {Fullnode} expected as dependency")
        }

        this.blockService = new BlockService(node);

        this.getBlockHash = this.getBlockHash.bind(this);
        this.getBlock = this.getBlock.bind(this);
        this.getRawBlock = this.getRawBlock.bind(this);
    }


    async getBlockHash(ctx, next) {
        if (ctx.params.height) {
            const blockHeight = parseInt(ctx.params.height);
            const isValid = ValidationUtils.validateBlockHeight(blockHeight);

            if (isValid) {
                try {
                    const blockHash = await this.blockService.getBlockHash(blockHeight);
                    if (!blockHash) {
                        ctx.status = 404;
                        ctx.body = new ErrorMessage('Block not found')
                    } else {
                        ctx.status = 200;
                        ctx.body = MappingService.mapGetBlockHash(blockHash);
                    }
                } catch (e) {
                    console.error(e);
                    ctx.status = 500;
                    ctx.body = new ErrorMessage('Could not get block hash, internal server error')
                }
            } else {
                ctx.status = 400;
                ctx.body = new ErrorMessage('Block index (height) is not valid');
            }
        } else {
            ctx.status = 400;
            ctx.body = new ErrorMessage('Block index (height) does not present')
        }
    }


    async getBlock(ctx, next) {
        if (ctx.params.blockHash) {
            const blockHash = ctx.params.blockHash;
            const isValid = ValidationUtils.validateBlockHash(blockHash);

            if (isValid) {
                try {
                    const block = await this.blockService.getBlock(blockHash);
                    const entry = await this.blockService.getEntry(blockHash);
                    const nextHash = await this.blockService.getNextHash(blockHash);
                    const bestBlockHeight = await this.blockService.getBestBlockHeight();
                    const isMainChain = await this.blockService.isMainChain(entry);

                    if (!block) {
                        ctx.status = 404;
                        ctx.body = new ErrorMessage('Block not found')
                    } else {
                        ctx.status = 200;
                        ctx.body = MappingService.mapGetBlock(block, entry, nextHash, bestBlockHeight, isMainChain);
                    }
                } catch (e) {
                    console.error(e);
                    ctx.status = 500;
                    ctx.body = new ErrorMessage('Could not get block, internal server error')
                }
            } else {
                ctx.status = 400;
                ctx.body = new ErrorMessage('Block hash is not valid')
            }
        } else {
            ctx.status = 400;
            ctx.body = new ErrorMessage('Block hash does not present');
        }
    }


    async getRawBlock(ctx, next) {
        if (ctx.params.blockHashOrHeight) {
            const blockHashOrHeight = ctx.params.blockHashOrHeight;
            const isBlockHash = ValidationUtils.validateBlockHash(blockHashOrHeight);
            const isBlockHeight = ValidationUtils.validateBlockHeight(blockHashOrHeight);

            if (isBlockHash) {
                try {
                    const block = await this.blockService.getBlock(blockHashOrHeight);
                    if (!block) {
                        ctx.status = 404;
                        ctx.body = new ErrorMessage('Block not found')
                    }

                    const rawBlock = block.toRaw().toString('hex');
                    ctx.status = 200;
                    ctx.body = MappingService.mapGetRawBlock(rawBlock);

                } catch (e) {
                    console.error(e);
                    ctx.status = 500;
                    ctx.body = new ErrorMessage('Could not get raw block, internal server error')
                }
            }
            else if (isBlockHeight) {
                const blockHash = await this.blockService.getBlockHash(blockHashOrHeight);
                const block = await this.blockService.getBlock(blockHash);

                if (!block) {
                    ctx.status = 404;
                    ctx.body = new ErrorMessage('Block not found')
                }

                const rawBlock = block.toRaw().toString('hex');
                ctx.status = 200;
                ctx.body = MappingService.mapGetRawBlock(rawBlock);
            } else {
                ctx.status = 400;
                ctx.body = new ErrorMessage('Block hash or height is not valid');
            }
        } else {
            ctx.status = 400;
            ctx.body = new ErrorMessage('Block hash or height does not present');
        }
    }


    async blocksSummaries(ctx, next) {

    }
}

module.exports = BlockController;