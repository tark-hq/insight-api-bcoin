//Service responsible for mapping results to insight-api spec https://github.com/bitpay/insight-api/blob/master/README.md
const Utils = require('../util/utils');
const config = require('../../config');
const BcoinAddress = require('bcoin').Address;

class MappingService {

    /**
     *
     * @param blockHash {string}
     */
    static mapGetBlockHash(blockHash) {
        return {blockHash: blockHash}
    }

    /**
     *
     * @param block {Block} bcoin block
     * @param entry {ChainEntry} bcoin ChainEntry
     */
    static mapGetBlock(block, entry, nextHash, bestBlockHeight, isMainChain) {

        const sizes = block.getSizes();
        const height = entry.height;
        const version = entry.version;
        const merkleRoot = entry.merkleRoot;

        const txs = block.txs.map((tx) => tx.rhash());
        const time = entry.time;
        const nonce = entry.nonce;
        const bits = entry.bits;
        const bitsHex = bits.toString(16);
        const difficulty = Utils.bitsToDifficulty(bits);
        const chainWork = entry.chainwork.toString();
        const confirmations = bestBlockHeight - 1 + height;
        const prevBlock = entry.prevBlock;
        const rewardSatoshis = block.getClaimed();
        const reward = Utils.satoshiToBTC(rewardSatoshis);

        //todo maybe implement witnessSize?
        //todo chainReward - probably not necessary
        //todo poolInfo - do or not
        return {
            hash: block.rhash(),
            size: sizes.size,
            height: height,
            version: version,
            merkleroot: merkleRoot,
            tx: txs,
            time: time,
            nonce: nonce,
            bits: bitsHex,
            difficulty: difficulty,
            chainwork: chainWork,
            confirmations: confirmations,
            previousblockhash: prevBlock,
            nextblockhash: nextHash,
            reward: reward,
            isMainChain: isMainChain,
            poolInfo: {}
        }
    }

    /**
     *
     * @param rawBlock {string} blockHex raw
     * @return {{rawBlock: *}}
     */
    static mapGetRawBlock(rawBlock) {
        return {
            rawBlock: rawBlock
        }
    }

    static mapGetRawTx(rawTx) {
        return {rawtx: rawTx}
    }

    /**
     *
     * @param tx {TX} bcoin tx
     */
    static mapGetTx(tx, meta, outputAddressesMetaMap) {

        const blockHash = Utils.reverseHex(meta.block);
        const blockHeight = meta.height;

        //in satoshis
        const valueIn = tx.inputs.reduce((accum, input) => accum + input.value, 0);
        const valueOut = tx.outputs.reduce((accum, output) => accum + output.value, 0);
        const fees = tx.inputs.reduce((accum, input) => accum + input.value, 0) - tx.outputs.reduce((accum, output) => accum + output.value, 0);

        const txMeta = {
            blockhash: blockHash,
            blockheight: blockHeight,
            confirmations: meta.confirmations,
            time: meta.time,
            blocktime: meta.time,
            valueOut: Utils.satoshiToBTC(valueOut),
            size: tx.getSize(),
            valueIn: Utils.satoshiToBTC(valueIn),
            fees: Utils.satoshiToBTC(fees)
        };

        const mapVins = (input, index) => {
            return {
                txid: input.prevout.hash,
                vout: input.prevout.index,
                sequence: input.sequence,
                n: index,
                scriptSig: {
                    hex: input.script.toRaw().toString('hex'),
                    asm: input.script.toASM()
                },
                addr: input.getAddress().toString(config.network),
                valueSat: input.value,
                value: Utils.satoshiToBTC(input.value)
            };
        };

        //todo whats the point of array of addresses in scriptPubKey?

        const mapVouts = (output, index) => {

            const {spentTxId, spentIndex, spentHeight} = outputAddressesMetaMap[output.script.getAddress().toString(config.network)];

            return {
                value: Utils.satoshiToBTC(output.value),
                valueSat: output.value,
                n: index,
                scriptPubKey: {
                    hex: output.script.toRaw().toString('hex'),
                    asm: output.script.toASM(),
                    addresses: [output.script.getAddress().toString(config.network)],
                    type: output.script.getAddress().getType().toLowerCase()
                },
                spentTxId: spentTxId,
                spentIndex: spentIndex,
                spentHeight: spentHeight
            };
        };


        const txid = tx.txid();
        const version = tx.version;
        const lockTime = tx.locktime;


        return {
            txid: txid,
            version: version,
            locktime: lockTime,
            vin: tx.inputs.map(mapVins),
            vout: tx.outputs.map(mapVouts),
            ...txMeta
        };

    }

}

module.exports = MappingService;