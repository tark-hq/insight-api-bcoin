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
        return {blockHash: Utils.reverseHex(blockHash)}
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
     * @param mtx {MTX} bcoin tx
     * @param spentOutputs from TransactionService
     */
    static mapGetTx(mtx, spentOutputs) {
        const blockHashBuffer = mtx.block;
        const blockHashBE = Utils.bufferToStr(blockHashBuffer);
        const blockHash = Utils.reverseHex(blockHashBE);
        const blockHeight = mtx.height;
        const tx = mtx.tx;

        //in satoshis
        const valueIn = tx.inputs.reduce((accum, input) => accum + input.value, 0);
        const valueOut = tx.outputs.reduce((accum, output) => accum + output.value, 0);
        const fees = tx.inputs.reduce((accum, input) => accum + input.value, 0) - tx.outputs.reduce((accum, output) => accum + output.value, 0);

        const txMeta = {
            blockhash: blockHash,
            blockheight: blockHeight,
            confirmations: mtx.confirmations,
            time: mtx.time,
            blocktime: mtx.time,
            valueOut: Utils.satoshiToBTC(valueOut),
            size: tx.getSize(),
            valueIn: Utils.satoshiToBTC(valueIn),
            fees: Utils.satoshiToBTC(fees)
        };

        const vinsMapper = (input, index) => {
            return {
                txid: Utils.reverseHex(Utils.bufferToStr(input.prevout.hash)),
                vout: input.prevout.index,
                sequence: input.sequence,
                n: index,
                scriptSig: {
                    hex: input.script.toRaw().toString('hex'),
                    asm: input.script.toASM()
                },
                addr: input.getAddress() && input.getAddress().toString(config.network),
                valueSat: input.value,
                value: Utils.satoshiToBTC(input.value)
            };
        };

        //todo whats the point of array of addresses in scriptPubKey?

        const voutsMapper = (spentOutputs, output, index) => {

            const address = output.script.getAddress() && output.script.getAddress().toString(config.network);
            const addresses = address || [];

            //const {spentTxId, spentIndex, spentHeight} = spentOutputs[index];
            const spentOutputMTX = spentOutputs[index];
            const spentTxId = spentOutputMTX && spentOutputMTX.tx.txid();
            //todo
            const spentIndex = null;
            const spentHeight = spentOutputMTX && spentOutputMTX.height;


            return {
                value: Utils.satoshiToBTC(output.value),
                valueSat: output.value,
                n: index,
                scriptPubKey: {
                    hex: output.script.toRaw().toString('hex'),
                    asm: output.script.toASM(),
                    addresses: addresses,
                    type: address && output.script.getAddress().getType().toLowerCase()
                },
                spentTxId: spentTxId,
                spentIndex: spentIndex,
                spentHeight: spentHeight
            };
        };

        const txid = tx.txid();
        const version = tx.version;
        const lockTime = tx.locktime;

        const vin = tx.inputs.map(vinsMapper);
        const vouts = tx.outputs.map(voutsMapper.bind(null, spentOutputs));

        return {
            txid: txid,
            version: version,
            locktime: lockTime,
            vin: vin,
            vout: vouts,
            ...txMeta
        };

    }


    /**
     *
     * @param addrStr
     * @param mtxs
     * @param txs {TX[]}
     * @param bestHeight
     * @param options
     */
    static mapGetAddress(addrStr, mtxs, txs, bestHeight, options) {

        if (options.from) {
            mtxs = mtxs.filter(mtx => mtx.height >= options.from);
        }

        if (options.to) {
            mtxs = mtxs.filter(mtx => mtx.height <= options.to);
        }

        const mtxsId = mtxs.map(mtx => mtx.tx.txid());

        txs = txs.filter(tx => mtxsId.indexOf(tx.txid()) !== -1);

        function inputFilter(input) {
            return input && input.getAddress() && input.getAddress().toString(config.network) === addrStr;
        }

        function outputFilter(output) {
            return output && output.getAddress() && output.getAddress().toString(config.network) === addrStr;
        }

        function valueReducer(accum, entity) {
            return accum + entity.value;
        }

        function totalReceivedReducer(accum, tx) {
            return accum + tx.outputs.filter(outputFilter).reduce(valueReducer, 0);
        }

        function totalSentReducer(accum, tx) {
            return accum + tx.inputs.filter(inputFilter).reduce(valueReducer, 0);
        }

        const totalSentSat = txs.reduce(totalSentReducer, 0);
        const totalReceivedSat = txs.reduce(totalReceivedReducer, 0);

        const balanceSat = totalReceivedSat - totalSentSat;
        const balance = Utils.satoshiToBTC(balanceSat);

        const totalReceived = Utils.satoshiToBTC(totalReceivedSat);
        const totalSent = Utils.satoshiToBTC(totalSentSat);


        const unconfirmedTxs = mtxs.filter(mtx => mtx.height === bestHeight);

        const totalUnconfirmedSentSat = unconfirmedTxs.reduce(totalSentReducer, 0);
        const totalUnconfirmedReceivedSat = unconfirmedTxs.reduce(totalReceivedReducer, 0);


        const unconfirmedBalanceSat = totalUnconfirmedReceivedSat - totalUnconfirmedSentSat;
        const unconfirmedBalance = Utils.satoshiToBTC(unconfirmedBalanceSat);


        //todo test
        const unconfirmedTxApperances = unconfirmedTxs.length;

        const txApperances = txs.length;
        const transactions = txs.map(tx => tx.txid());

        let result = {
            addrStr: addrStr,
            balance: balance,
            balanceSat: balanceSat,
            totalReceived: totalReceived,
            totalReceivedSat: totalReceivedSat,
            totalSent: totalSent,
            totalSentSat: totalSentSat,
            unconfirmedBalance: unconfirmedBalance,
            unconfirmedBalanceSat: unconfirmedBalanceSat,
            unconfirmedTxApperances: unconfirmedTxApperances,
            txApperances: txApperances,
        };

        if (!options.noTxList) {
            result.transactions = transactions;
        }

        return result;
    }

    static mapGetUTXOsByAddress(coins, bestHeight) {
        return coins.map(coin => {
            return {
                address: coin.getAddress().toString(config.network),
                txid: Utils.reverseHex(coin.hash.toString('hex')),
                vout: coin.index,
                scriptPubKey: coin.script.toRaw().toString('hex'),
                amount: Utils.satoshiToBTC(coin.value),
                satoshis: coin.value,
                height: coin.height,
                confirmations: bestHeight - coin.height + 1
            }
        });
    }
}


module.exports = MappingService;