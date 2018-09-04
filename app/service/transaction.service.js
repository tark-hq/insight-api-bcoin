const Outpoint = require('bcoin').Outpoint;
const TX = require('bcoin').TX;
const Utils = require('../util/utils');
const config = require('../../config');
const ErrorMessage = require('../model/ErrorMessage');
const SpentOutput = require('../model/SpentOutput');
const AddressService = require('../service/address.service');

class TransactionService {

    /**
     *
     * @param node {FullNode} bcoin's fullnode
     */
    constructor(node) {
        if (!node) {
            throw new Error("Bcoin {Fullnode} expected as dependency")
        }

        this.node = node;

        this.addressService = new AddressService(node);

        this.getTransaction = this.getTransaction.bind(this);
        this.getRawTransaction = this.getRawTransaction.bind(this);
        this.getMetaTransaction = this.getMetaTransaction.bind(this);
        this.getMetasByAddress = this.getMetasByAddress.bind(this);
        this.getSpentOutputs = this.getSpentOutputs.bind(this);
    }


    /**
     * Returns {MTX} meta transaction object with some meta fields and transaction object. See {@link {MTX}}
     *
     * @param hash {string} transaction hash, big-endian order
     * @return {Promise<MTX> || null}
     */
    async getMetaTransaction(hash) {
        const hashBuffer = Utils.strToBuffer(hash);
        let meta = await this.node.getMeta(hashBuffer);

        if (meta) {
			const view = await this.node.getMetaView(meta);
			meta.tx.inputs = meta.tx.inputs.map(this._inputValuesMapper.bind(null, view));
            meta.confirmations = this.node.chain.height + 1 - meta.height;
        }

        return meta;
    }

    /**
     * Returns {MTX} meta transaction object with some meta fields and transaction object. See {@link {MTX}}
     *
     * @param addr {string} address
     * @return {Promise<MTX[]> || null}
     */
    async getMetasByAddress(addr) {
        const hashBuffer = Utils.strToBuffer(addr);
        const address = Utils.addrStrToAddress(addr);
        let metas = await this.node.getMetaByAddress(address);

        if (metas) {
            metas = await Promise.all(metas.map(async mtx => {
                const view = await this.node.getMetaView(mtx);
                mtx.tx.inputs = mtx.tx.inputs.map(this._inputValuesMapper.bind(null, view));
                mtx.confirmations = this.node.chain.height + 1 - mtx.height;
                return mtx;
            }))

        }

        return metas;
    }

    /**
     * Returns transaction {TX}
     *
     * @param hash {string} transaction hash, big-endian order
     * @return {Promise<TX>} bcoin TX primitive
     */
    async getTransaction(hash) {
        const hashBuffer = Utils.strToBuffer(hash);

        const meta = await this.node.getMeta(hashBuffer);

        if (!meta) {
            return null;
        }

        const view = await this.node.getMetaView(meta);

        let tx = meta.tx;
        tx.inputs = tx.inputs.map(this._inputValuesMapper.bind(null, view));

        return tx;
    }

    /**
     * Returns raw transaction in hex format
     *
     * @param hash {string} transaction hash, big-endian order
     * @returns {Promise<string>}
     */
    async getRawTransaction(hash) {
        const hashBuffer = Utils.strToBuffer(hash);

        let tx = await this.node.getTX(hashBuffer);

        return tx && tx.toRaw().toString('hex');
    }


    /**
     * Returns {Array} of {MTX} of spent outputs. Returns false or MTX. Index always match index of outputs of tx.
     * @param tx {TX} transaction object
     * @return {Promise<MTX[]>}
     */
    async getSpentOutputs(tx) {
        return await Promise.all(tx.outputs.map(async (output, index) => {
            const outpoint = Outpoint.fromOptions({
                hash: tx.hash(),
                index: index
            });

            const spentTxHashBuffer = await this.node.outpointindex.getTX(outpoint);

            if (spentTxHashBuffer) {
                const spentMTx = await this.node.getMeta(spentTxHashBuffer);

                const spentTx = spentMTx.tx;


                const inputIndex = spentTx.inputs.findIndex(inputIndexPredicate.bind(null, tx, index));

                function inputIndexPredicate(tx, originalIndex, input) {
                    return input.prevout.hash.equals(tx.hash()) && input.prevout.index === index;
                }

                return new SpentOutput(inputIndex, spentMTx);
            }

            return null;
        }));
    }

    /**
     *
     * @param txHex {string}
     * @return {Promise<void>}
     */
    async broadcastTransaction(txHex) {
        const tx = TX.fromRaw(txHex, 'hex');

        await this.node.sendTX(tx);

    }


    /**
     * Private method, maps coin value to the input
     * @param view {CoinView}
     * @param input {Input}
     * @return {Input}
     * @private
     */
    _inputValuesMapper(view, input) {
        //ensure existence
        input.value = null;

        if (!input.isCoinbase()) {
            const coin = view.getCoin(input.prevout);

            if (coin) {
                input.value = coin.value
            }
        }

        return input;
    }
}


module.exports = TransactionService;