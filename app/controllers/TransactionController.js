const config = require('../../config');
const assert = require('assert');
const ErrorMessage = require('../model/ErrorMessage');

const AddressService = require('../service/address.service');
const BlockService = require('../service/block.service');
const MappingService = require('../service/mapping.service');
const TransactionService = require('../service/transaction.service');

const ValidationUtils = require('../util/validation.utils');
const Utils = require('../util/utils');

class TransactionController {

    /**
     *
     * @param node {FullNode} bcoin's full node
     */
    constructor(node) {
        if (!node) {
            throw new Error('Bcoin {Fullnode} expected as dependency');
        }

        this.transactionService = new TransactionService(node);
        this.addressService = new AddressService(node);
        this.blockService = new BlockService(node);

        this.getTransaction = this.getTransaction.bind(this);
        this.getRawTransaction = this.getRawTransaction.bind(this);
        this.getTransactionsByBlockHashOrAddress = this.getTransactionsByBlockHashOrAddress.bind(this);
        this.getTransactionsByBlockHash = this.getTransactionsByBlockHash.bind(this);
        //this.getTransactionsByAddress = this.getTransactionsByAddress.bind(this);
    }

    async getTransaction(ctx, next) {
        let txid = ctx.params.txid;
        const isValid = ValidationUtils.validateTxid(txid);
        if (isValid) {
            try {
                //reverse byte-order, software\explorers shows big-endian hashes
                const txHash = Utils.reverseHex(txid);
                const mtx = await this.transactionService.getMetaTransaction(txHash);

                if (mtx) {
                    const spentOutputs = await this.transactionService.getSpentOutputs(mtx.tx);

                    ctx.status = 200;
                    ctx.body = MappingService.mapGetTx(mtx, spentOutputs);
                } else {
                    ctx.status = 404;
                    ctx.body = new ErrorMessage('Tx not found');
                }
            } catch (e) {
                console.error(e);
                ctx.status = 500;
                ctx.body = new ErrorMessage('Could not get tx, internal server error');
            }
        } else {
            ctx.status = 400;
            ctx.body = new ErrorMessage('Txid is not valid');
        }
    }

    async getRawTransaction(ctx, next) {
        let txid = ctx.params.txid;
        const isValid = ValidationUtils.validateTxid(txid);
        if (isValid) {
            try {
                //reverse byte-order, software\explorers shows big-endian hashes
                const txIdLittleEndian = Utils.reverseHex(txid);
                const rawTx = await this.transactionService.getRawTransaction(txIdLittleEndian);

                if (rawTx) {
                    ctx.status = 200;
                    ctx.body = MappingService.mapGetRawTx(rawTx);
                } else {
                    ctx.status = 404;
                    ctx.body = new ErrorMessage('Raw Tx not found');
                }
            } catch (e) {
                console.error(e);
                ctx.status = 500;
                ctx.body = new ErrorMessage('Could not get rawTx, internal server error');
            }
        } else {
            ctx.status = 400;
            ctx.body = new ErrorMessage('Txid is not valid');
        }
    }


    async getTransactionsByBlockHashOrAddress(ctx, next) {
        if (ctx.query.block) {
            await this.getTransactionsByBlockHash(ctx, next);
        } else if (ctx.query.address) {
            await this.getTransactionsByAddress(ctx, next);
        } else {
            return next();
        }
    }


    async getTransactionsByBlockHash(ctx, next) {
        const blockHash = ctx.query.block;
        const pageNum = ctx.query.pageNum || 0;

        const isValid = ValidationUtils.validateBlockHash(blockHash);
        if (isValid) {
            const block = await this.blockService.getBlock(Utils.reverseHex(blockHash));
            if (block) {
                const txids = block.txs.map(tx => tx.txid());
                const pagesTotal = Math.ceil(txids.length / 10);
                const txidsPaged = txids.slice(pageNum * 10, 10);
                const txHashes = txidsPaged.map(txid => Utils.reverseHex(txid));
                const mtxs = await Promise.all(txHashes.map(async txHash => await this.transactionService.getMetaTransaction(txHash)));

                const result = {
                    pagesTotal: pagesTotal
                };

                result.txs = await Promise.all(mtxs.map(async mtx => {
                    const spentOutputs = await this.transactionService.getSpentOutputs(mtx.tx);
                    return MappingService.mapGetTx(mtx, spentOutputs);
                }));

                ctx.body = result;
                ctx.status = 200;
            } else {
                ctx.status = 400;
                ctx.body = new ErrorMessage('Block not found');
            }

        } else {
            ctx.status = 400;
            ctx.body = new ErrorMessage('Blockhash is not valid');
        }
    }

}

module.exports = TransactionController;