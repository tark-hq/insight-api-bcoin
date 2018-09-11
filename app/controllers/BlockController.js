const ErrorMessage = require('../model/ErrorMessage');

const BlockService = require('../service/block.service');
const MappingService = require('../service/mapping.service');

const ValidationUtils = require('../util/validation.utils');
const Utils = require('../util/utils');

class BlockController {

    /**
     *
     * @param node {FullNode} bcoin's full node
     */
    constructor(node) {
        if (!node) {
            throw new Error('Bcoin {Fullnode} expected as dependency');
        }

        this.blockService = new BlockService(node);

        this.getBlockHash = this.getBlockHash.bind(this);
        this.getBlock = this.getBlock.bind(this);
        this.getRawBlock = this.getRawBlock.bind(this);
        this.getBlockSummaries = this.getBlockSummaries.bind(this);
    }


    async getBlockHash(ctx, next) {
        const blockHeight = parseInt(ctx.params.height);
        const isValid = ValidationUtils.validateBlockHeight(blockHeight);

        if (isValid) {
            try {
                const blockHash = await this.blockService.getBlockHash(blockHeight);
                if (!blockHash) {
                    ctx.status = 404;
                    ctx.body = new ErrorMessage('Block not found');
                } else {
                    ctx.status = 200;
                    ctx.body = MappingService.mapGetBlockHash(blockHash);
                }
            } catch (e) {
                console.error(e);
                ctx.status = 500;
                ctx.body = new ErrorMessage('Could not get block hash, internal server error');
            }
        } else {
            ctx.status = 400;
            ctx.body = new ErrorMessage('Block index (height) is not valid');
        }
    }


    async getBlock(ctx, next) {
        const isValid = ValidationUtils.validateBlockHash(ctx.params.blockHash);

        if (isValid) {
            const blockHash = Utils.reverseHex(ctx.params.blockHash);

            try {
                const block = await this.blockService.getBlock(blockHash);
                const entry = await this.blockService.getEntry(blockHash);
                const nextHash = await this.blockService.getNextHash(blockHash);

                if (!block || !entry) {
                    ctx.status = 404;
                    ctx.body = new ErrorMessage('Block not found');
                } else {
                    const bestBlockHeight = await this.blockService.getBestBlockHeight();
                    const isMainChain = await this.blockService.isMainChain(entry);

                    ctx.status = 200;
                    ctx.body = MappingService.mapGetBlock(block, entry, nextHash, bestBlockHeight, isMainChain);
                }
            } catch (e) {
                console.error(e);
                ctx.status = 500;
                ctx.body = new ErrorMessage('Could not get block, internal server error');
            }
        } else {
            ctx.status = 400;
            ctx.body = new ErrorMessage('Block hash is not valid');
        }
    }


    async getRawBlock(ctx, next) {
        const blockHash = ctx.params.blockHashOrHeight;
        const blockHeight = Number(ctx.params.blockHashOrHeight);
        const isBlockHash = ValidationUtils.validateBlockHash(blockHash);
        const isBlockHeight = ValidationUtils.validateBlockHeight(blockHeight);

        if (!isBlockHash && !isBlockHeight) {
            ctx.status = 400;
            ctx.body = new ErrorMessage('Block hash or height is not valid');
            return;
        }

        let hash;

        if (isBlockHeight) {
            hash = await this.blockService.getBlockHash(blockHeight);
        } else if (isBlockHash) {
            hash = Utils.reverseHex(blockHash);
        }

        try {
            const block = await this.blockService.getBlock(hash);

            if (!block) {
                ctx.status = 404;
                ctx.body = new ErrorMessage('Raw block not found');
                return;
            }

            const rawBlock = block.toRaw().toString('hex');
            ctx.status = 200;
            ctx.body = MappingService.mapGetRawBlock(rawBlock);

        } catch (e) {
            console.error(e);
            ctx.status = 500;
            ctx.body = new ErrorMessage('Could not get raw block, internal server error');
        }
    }


    async getBlockSummaries(ctx, next) {
        const limit = Number(ctx.request.query.limit);
        const blockDate = ctx.request.query.blockDate;

        const now = new Date();

        let from;
        let to;

        if (!blockDate) {
            const blockDateUTC = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
            from = Math.floor(blockDateUTC / 1000);
            to = from + 86400;
        } else {
            const isValid = ValidationUtils.validateDateString(blockDate);

            if (!isValid) {
                ctx.status = 400;
                ctx.body = new ErrorMessage('Date is not valid');
                return;
            }

            const splitted = blockDate.split('-');

            const blockDateUTC = Date.UTC(splitted[0], splitted[1] - 1, splitted[2]);
            from = Math.floor(blockDateUTC / 1000);
            to = from + 86400;
        }


        let blocks = await this.blockService.getBlocksByTimestamp(from, to);

        ctx.status = 200;
        ctx.body = MappingService.mapGetBlockSummaries(blocks, from, to, limit);

    }
}

module.exports = BlockController;