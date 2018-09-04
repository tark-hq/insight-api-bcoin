const Utils = require('../util/utils');

class StatusService {

    /**
     *
     * @param node {FullNode} bcoin's fullnode
     */
    constructor(node) {
        if (!node) {
            throw new Error('Bcoin {Fullnode} expected as dependency');
        }

        this.node = node;

        this.getSyncStatus = this.getSyncStatus.bind(this);
        this.getPeerStatus = this.getPeerStatus.bind(this);
        this.getInfo = this.getInfo.bind(this);
        this.getDifficulty = this.getDifficulty.bind(this);
        this.getBestBlockHash = this.getBestBlockHash.bind(this);

    }


    async getSyncStatus() {
        const isSynced = this.node.chain.synced;
        const height = this.node.chain.height;
        const percentage = this.node.chain.getProgress() * 100;

        return {
            status: isSynced ? 'finished' : 'syncing',
            blockChainHeight: height,
            syncPercentage: percentage,
            height: height,
            error: null,
            type: 'bcoin node'
        };
    }


    async getPeerStatus() {
        const isConnected = this.node.pool.connected;
        const host = this.node.pool.hosts.address.host;
        const port = this.node.pool.hosts.address.port;

        return {
            connected: isConnected,
            host: host,
            port: port
        };
    }

    async getInfo() {
        const blocks = this.node.chain.height + 1;
        const userAgent = this.node.pool.options.agent;
        const protocolVersion = this.node.pool.options.version;
        const timeOffset = this.node.network.time.offset;
        const connections = this.node.pool.peers.size();
        const proxy = this.node.pool.options.proxy;
        const difficulty = Utils.bitsToDifficulty(this.node.chain.tip.bits);
        const isTestnet = this.node.network.type === 'testnet';
        const networkType = this.node.network.type;
        const relayFee = Utils.satoshiToBTC(this.node.network.minRelay);

        //todo unknown bits in errors

        return {
            info: {
                version: userAgent,
                protocolversion: protocolVersion,
                blocks: blocks,
                timeoffset: timeOffset,
                connections: connections,
                proxy: proxy ? '' : proxy,
                difficulty: difficulty,
                testnet: isTestnet,
                relayfee: relayFee,
                errors: null,
                network: networkType
            }
        };
    }


    async getDifficulty() {
        return Utils.bitsToDifficulty(this.node.chain.tip.bits);
    }

    async getBestBlockHash() {
        return Utils.reverseHex(this.node.chain.tip.hash.toString('hex'));

    }


}

module.exports = StatusService;