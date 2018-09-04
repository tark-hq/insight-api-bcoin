const bcoin = require('bcoin');
const TX = bcoin.TX;
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

    static validateHex(hexString) {
        return typeof hexString === 'string' && new RegExp(/^[A-Fa-f0-9]{1,}$/).test(hexString);
    }

    static validateRawTx(txHex) {
        const validBody = this.validateHex(txHex);

        if (!validBody) {
            return false;
        }

        try {
            return !!TX.fromRaw(txHex, 'hex');
        }
        catch (e) {
            return false;
        }
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
