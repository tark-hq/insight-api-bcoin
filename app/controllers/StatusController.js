const ErrorMessage = require('../model/ErrorMessage');

const StatusService = require('../service/status.service');

class StatusController {

    /**
     *
     * @param node {FullNode} bcoin's full node
     */
    constructor(node) {
        if (!node) {
            throw new Error('Bcoin {Fullnode} expected as dependency');
        }

        this.statusService = new StatusService(node);

        this.getSyncStatus = this.getSyncStatus.bind(this);
        this.getPeerInfo = this.getPeerInfo.bind(this);
        this.getStatus = this.getStatus.bind(this);

    }


    async getSyncStatus(ctx, next) {
        const syncStatus = await this.statusService.getSyncStatus();

        ctx.status = 200;
        ctx.body = syncStatus;
    }

    async getPeerInfo(ctx, next) {
        const peerStatus = await this.statusService.getPeerStatus();

        ctx.status = 200;
        ctx.body = peerStatus;
    }


    async getInfo(ctx, next) {
        const info = await this.statusService.getInfo();

        ctx.body = info;
        ctx.status = 200;
    }

    async getDifficulty(ctx, next) {
        const difficulty = await this.statusService.getDifficulty();

        ctx.body = {difficulty: difficulty};
        ctx.status = 200;
    }

    async getBestBlockHash(ctx, next) {
        const bestBlockHash = await this.statusService.getBestBlockHash();

        ctx.body = {bestblockhash: bestBlockHash};
        ctx.status = 200;

    }

    async getLastBlockHash(ctx, next) {
        const bestBlockHash = await this.statusService.getBestBlockHash();

        ctx.body = {syncTipHash: bestBlockHash, lastblockhash: bestBlockHash};
        ctx.status = 200;
    }


    async getStatus(ctx, next) {
        const queryParams = ctx.query.q;

        try {
            if (!queryParams) {
                await this.getInfo(ctx, next);
                return;
            }

            switch (queryParams) {
                case 'getInfo':
                    await this.getInfo(ctx, next);
                    break;
                case 'getDifficulty':
                    await this.getDifficulty(ctx, next);
                    break;
                case 'getBestBlockHash':
                    await this.getBestBlockHash(ctx, next);
                    break;
                case 'getLastBlockHash':
                    await this.getLastBlockHash(ctx, next);
                    break;
                default:
                    await this.getInfo(ctx, next);
                    break;
            }
        }
        catch (e) {
            console.error(e);
            ctx.body = new ErrorMessage("Internal server error");
            ctx.status = 500;
        }
    }

}

module.exports = StatusController;