class Utils {
    /**
     * Converts bits to difficulty
     * Stolen from bcoin
     * @param bits {number}
     * @return {number}
     */
    static bitsToDifficulty(bits) {
        let shift = (bits >>> 24) & 0xff;
        let diff = 0x0000ffff / (bits & 0x00ffffff);

        while (shift < 29) {
            diff *= 256.0;
            shift++;
        }

        while (shift > 29) {
            diff /= 256.0;
            shift--;
        }

        return diff;
    }


    static satoshiToBTC(satoshis) {
        return satoshis / 100000000;
    }
}

module.exports = Utils;