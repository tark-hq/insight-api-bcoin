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
            throw new Error("Bcoin {Fullnode} expected as dependency")
        }

        this.transactionService = new TransactionService(node);
        this.addressService = new AddressService(node);

        this.getTransaction = this.getTransaction.bind(this);
        this.getRawTransaction = this.getRawTransaction.bind(this);
    }

    async getTransaction(ctx, next) {
        if (ctx.params.txid) {
            let txid = ctx.params.txid;
            const isValid = ValidationUtils.validateTxid(txid);
            if (isValid) {
                try {
                    //reverse byte-order, software\explorers shows big-endian hashes
                    const txIdLittleEndian = Utils.reverseHex(txid);
                    const tx = await this.transactionService.getTransaction(txIdLittleEndian, true);
                    const meta = await this.transactionService.getMeta(txIdLittleEndian);
                    const outputAddressesMetaMap = await this.transactionService.getSpentTxsMap(tx);

                    if (tx) {
                        ctx.status = 200;
                        ctx.body = MappingService.mapGetTx(tx, meta, outputAddressesMetaMap);
                    } else {
                        ctx.status = 404;
                        ctx.body = new ErrorMessage('Not found');
                    }
                } catch (e) {
                    console.error(e);
                    ctx.status = 500;
                    ctx.body = new ErrorMessage('Could not get tx, internal server error');
                }
            } else {
                ctx.status = 404;
                ctx.body = new ErrorMessage('Txid is not valid')
            }
        } else {
            ctx.status = 400;
            ctx.body = new ErrorMessage('Txid is not specified')
        }

    }

    async getRawTransaction(ctx, next) {
        if (ctx.params.txid) {
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
                        ctx.body = new ErrorMessage('Not found');
                    }
                } catch (e) {
                    console.error(e);
                    ctx.status = 500;
                    ctx.body = new ErrorMessage('Could not get rawTx, internal server error');
                }
            } else {
                ctx.status = 404;
                ctx.body = new ErrorMessage('Txid is not valid')
            }
        } else {
            ctx.status = 400;
            ctx.body = new ErrorMessage('Txid is not specified')
        }
    }
}

module.exports = TransactionController;