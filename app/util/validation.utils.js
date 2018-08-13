class ValidationUtils {

    static validateBlockHeight(blockHeight) {
        return typeof blockHeight === 'number' && blockHeight >= 0;
    }

    static validateBlockHash(blockHash) {
        return typeof blockHash === 'string' && new RegExp(/^[a-fA-F0-9]{64}$/).test(blockHash);
    }

    static validateTxid(txid) {
        return typeof txid === 'string' && new RegExp(/^[a-fA-F0-9]{64}$/).test(txid);
    }

}

module.exports = ValidationUtils;
