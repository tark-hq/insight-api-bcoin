const Utils = require('../util/utils');
const config = require('../../config');
const ErrorMessage = require('../model/ErrorMessage');
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
        this.getSpentTxsMap = this.getSpentTxsMap.bind(this);
    }


    async getMeta(hash) {
        let mtx = await this.node.getMeta(hash);
        mtx.confirmations = this.node.chain.height + 1 - mtx.height;

        return mtx;
    }

    /**
     *
     * @param hash {string} transaction hash, big-endian order
     * @param includeInputValues {boolean} whether to include input values
     * @return {Promise<TX>} bcoin TX primitive
     */
    async getTransaction(hash, includeInputValues) {
        let tx = await this.node.getTX(hash);

        if (tx && includeInputValues) {
            tx = await this._populateInputValues(tx);
        }

        return tx;
    }

    /**
     *
     * @param hash {string} transaction hash, big-endian order
     * @returns {Promise<string>}
     */
    async getRawTransaction(hash) {
        let tx = await this.node.getTX(hash);

        if (tx) {
            return tx.toRaw().toString('hex');
        } else {
            return null
        }
    }


    /**
     * Returns map<address -> {
     *           "spentTxId": spentTxId || null,
     *           "spentIndex": spentIndex || null,
     *           "spentHeight": spentHeight || null
     *       }>
     * @param tx {TX}
     * @returns {Promise<void>}
     */
    async getSpentTxsMap(tx) {
        const outputAddresses = tx.outputs.map((output, index) => {
            return {
                address: output.script.getAddress().toString(config.network),
                txid: tx.txid(),
                n: index
            }
        });

        return await (outputAddresses.reduce(async (map, outputAddressObj) => {
            let outputAddress = outputAddressObj.address;
            let outputIndex = outputAddressObj.n;
            let outputTxId = outputAddressObj.txid;
            let outputHash = Utils.reverseHex(outputTxId);

            let _map = await map;
            let spentTxId = null;
            let spentIndex = null;
            let spentHeight = null;

            let metas = await this.addressService.getMetasByAddress(outputAddress);
            console.log('scanning output with address', outputAddress);
            //filtering out only those metas which have our txid in the inputs (aka spent transactions)
            metas.forEach((mtx) => {
                let _tx = mtx.tx;
                _tx.inputs.forEach((input, index) => {
                    if (input.prevout.hash === outputHash && input.prevout.index === outputIndex) {
                        console.log(`txid ${tx.txid()} spent at ${_tx.txid()} index #${index}`);
                        spentTxId = _tx.txid();
                        spentIndex = index;
                        spentHeight = mtx.height;
                    }
                })
            });


            _map[outputAddress] = {
                "spentTxId": spentTxId,
                "spentIndex": spentIndex,
                "spentHeight": spentHeight
            };

            return _map;
        }, {}));
    }


    async _populateInputValues(tx) {
        let inputs = tx.inputs;

        tx.inputs = await Promise.all(inputs.map(async input => {

            if (input.isCoinbase()) {
                input.value = null;
                return input
            }

            //get prevOut
            let prevoutHash = input.prevout.hash;
            let prevoutIndex = input.prevout.index;

            //search tx by hash
            let prevTx = await this.node.getTX(prevoutHash);

            if (!prevTx) {
                Promise.reject(new ErrorMessage(`Invalid to find prevTx with hash ${prevoutHash} of tx ${tx.txid()}`))
            }

            let value = prevTx.outputs[prevoutIndex].value;
            input.value = value;

            return input;
        }));

        return tx;
    }
}


module.exports = TransactionService;