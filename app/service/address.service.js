class AddressService {

    constructor(node) {
        if (!node) {
            throw new Error("Bcoin {Fullnode} expected as dependency")
        }

        this.node = node;

        this.getMetasByAddress = this.getMetasByAddress.bind(this);
        this.getCoinsByAddress = this.getCoinsByAddress.bind(this);
    }


    /**
     * Retrieves all meta about transactions as long as with transactions objects pertaining to given address
     *
     * @param address {string}
     *
     * @return {MTX[]}
     */
    async getMetasByAddress(address) {
        let mtxs = await this.node.getMetaByAddress(address);

        return mtxs;
    }


    /**
     *
     * Gets unspent outputs for the given address
     * Coin is the UTXO
     *
     * @returns {Promise<Coin[]>}
     */
    async getCoinsByAddress(address) {
        //utxos
        const coins = await this.node.getCoinsByAddress(address);

        return coins;
    }

    //todo refactor, move out to transactionService
    async _populateInputValues(txs) {
        return await Promise.all(txs.map(async tx => {
            //get inputs
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
                    Promise.reject(new Error(`Invalid to find prevTx with hash ${prevoutHash} of tx ${tx.txid()}`))
                }

                let value = prevTx.outputs[prevoutIndex].value;
                input.value = value;

                return input;
            }));
            return tx;
        }))
    }

}

module.exports = AddressService;