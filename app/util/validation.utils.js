const bcoin = require('bcoin');

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
        let isBase58 = false,
            isBech32 = false;

        try {
            bcoin.Address.fromBase58(address);
            isBase58 = true;
        } catch (e) {
            isBase58 = false;
        }

        try {
            bcoin.Address.fromBech32(address);
            isBech32 = true;
        } catch (e) {
            isBech32 = false;
        }

        return validType && (isBase58 || isBech32);
    }

}

module.exports = ValidationUtils;
