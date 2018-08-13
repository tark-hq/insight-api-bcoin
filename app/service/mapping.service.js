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


        const exmpl = {
            "txid": "f3ea8a564822fbeb0ceb952864f06331b4659eaae743aef9a19b79d1505536ac",
            "version": 1,
            "locktime": 0,
            "blockhash": "00000000000000d342cf299c53dc451819669b177bbfaf34229da5243d24cf73",
            "blockheight": 1381913,
            "confirmations": 4,
            "time": 1533717756,
            "blocktime": 1533717756,
            "valueOut": 4.60223722,
            "size": 657,
            "valueIn": 4.60236922,
            "fees": 0.000132
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

        //todo
        const example = {
            "txid": "f3ea8a564822fbeb0ceb952864f06331b4659eaae743aef9a19b79d1505536ac",
            "version": 1,
            "locktime": 0,
            "vout": [{
                "value": "0.00280000",
                "n": 0,
                "scriptPubKey": {
                    "hex": "76a914078b588b8eed2c357d9143d32aa3c1cb38f1586388ac",
                    "asm": "OP_DUP OP_HASH160 078b588b8eed2c357d9143d32aa3c1cb38f15863 OP_EQUALVERIFY OP_CHECKSIG",
                    "addresses": ["mgCqxKQwDf4NVciun8sMT4MPWFnKgoSfU7"],
                    "type": "pubkeyhash"
                },
                "spentTxId": null,
                "spentIndex": null,
                "spentHeight": null
            }, {
                "value": "0.00280000",
                "n": 1,
                "scriptPubKey": {
                    "hex": "76a9140b53f448eba75639c312f9c3ea8b70d5ba3dd6de88ac",
                    "asm": "OP_DUP OP_HASH160 0b53f448eba75639c312f9c3ea8b70d5ba3dd6de OP_EQUALVERIFY OP_CHECKSIG",
                    "addresses": ["mgYrJQYubixiBDUYT7xBRoJcsEEsnS9Ncb"],
                    "type": "pubkeyhash"
                },
                "spentTxId": null,
                "spentIndex": null,
                "spentHeight": null
            }, {
                "value": "0.00280000",
                "n": 2,
                "scriptPubKey": {
                    "hex": "76a914c1c284e27f7fb7891cac0b945c3414657b67986e88ac",
                    "asm": "OP_DUP OP_HASH160 c1c284e27f7fb7891cac0b945c3414657b67986e OP_EQUALVERIFY OP_CHECKSIG",
                    "addresses": ["myBTjVxD9jfWF7ZhYnHCkJQP5jQP6jbqux"],
                    "type": "pubkeyhash"
                },
                "spentTxId": null,
                "spentIndex": null,
                "spentHeight": null
            }, {
                "value": "1.03732160",
                "n": 3,
                "scriptPubKey": {
                    "hex": "76a914c48663ff53e151cc6f3bd0704261c8aa87294b1088ac",
                    "asm": "OP_DUP OP_HASH160 c48663ff53e151cc6f3bd0704261c8aa87294b10 OP_EQUALVERIFY OP_CHECKSIG",
                    "addresses": ["myS5jGz3eJK2u4AuUhwjRz189C3cA62uZc"],
                    "type": "pubkeyhash"
                },
                "spentTxId": "9ab293c8421cff2f000a9fbeb16d099fe64e3907ac253346a7b1f3f07898422d",
                "spentIndex": 0,
                "spentHeight": 1381914
            }, {
                "value": "1.67816522",
                "n": 4,
                "scriptPubKey": {
                    "hex": "76a9149ca19c88c9b549471ae2bb96b1d64121477315a588ac",
                    "asm": "OP_DUP OP_HASH160 9ca19c88c9b549471ae2bb96b1d64121477315a5 OP_EQUALVERIFY OP_CHECKSIG",
                    "addresses": ["muo9JwXAbzGmMuAtFaa1YqMb2cEpps69z8"],
                    "type": "pubkeyhash"
                },
                "spentTxId": "9ab293c8421cff2f000a9fbeb16d099fe64e3907ac253346a7b1f3f07898422d",
                "spentIndex": 1,
                "spentHeight": 1381914
            }, {
                "value": "1.87835040",
                "n": 5,
                "scriptPubKey": {
                    "hex": "76a9145dc87a59436e433145385a6c0a752fd8279b77b688ac",
                    "asm": "OP_DUP OP_HASH160 5dc87a59436e433145385a6c0a752fd8279b77b6 OP_EQUALVERIFY OP_CHECKSIG",
                    "addresses": ["mp4qJLweXxfAJPeH2wbvbQpVk5L8ExH2KR"],
                    "type": "pubkeyhash"
                },
                "spentTxId": "9ab293c8421cff2f000a9fbeb16d099fe64e3907ac253346a7b1f3f07898422d",
                "spentIndex": 2,
                "spentHeight": 1381914
            }],
            "blockhash": "00000000000000d342cf299c53dc451819669b177bbfaf34229da5243d24cf73",
            "blockheight": 1381913,
            "confirmations": 4,
            "time": 1533717756,
            "blocktime": 1533717756,
            "valueOut": 4.60223722,
            "size": 657,
            "valueIn": 4.60236922,
            "fees": 0.000132
        }
    }

}

module.exports = MappingService;