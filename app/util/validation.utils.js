const bcoin = require('bcoin');
const config = require('../../config');

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

    static validateAddress(address) {
        let validType = typeof address === 'string';

        if (!validType) {
            return false;
        }

        try {
            bcoin.Address.fromString(address, config.network);
            return true;
        } catch (e) {
            return false;
        }
    }
}

module.exports = ValidationUtils;
