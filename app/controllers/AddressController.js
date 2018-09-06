const AddressService = require('../service/address.service');
const TransactionService = require('../service/transaction.service');
const MappingService = require('../service/mapping.service');
const ValidationUtils = require('../util/validation.utils');
const ErrorMessage = require('../model/ErrorMessage');

const Utils = require('../util/utils');

class AddressController {

    /**
     *
     * @param node {FullNode} bcoin's full node
     */
    constructor(node) {
        if (!node) {
            throw new Error('Bcoin {Fullnode} expected as dependency');
        }

        this.node = node;

        this.addressService = new AddressService(node);
        this.transactionService = new TransactionService(node);

        this.getAddressInfo = this.getAddressInfo.bind(this);
        this.getAddressBalance = this.getAddressBalance.bind(this);
        this.getAddressTotalReceived = this.getAddressTotalReceived.bind(this);
        this.getAddressTotalSent = this.getAddressTotalSent.bind(this);
        this.getAddressUnconfirmedBalance = this.getAddressUnconfirmedBalance.bind(this);
        this.getAddressUnspentOutputs = this.getAddressUnspentOutputs.bind(this);
        this.getAddressesUnspentOutputs = this.getAddressesUnspentOutputs.bind(this);
    }


    /**
     *
     * @param ctx {Object} koa's ctx
     * @param next {Function}
     */
    async getAddressInfo(ctx, next) {
        let addr = ctx.params.address;
        const isValid = ValidationUtils.validateAddress(addr);

        const options = {
            noTxList: ctx.query.noTxList && parseInt(ctx.query.noTxList),
            from: ctx.query.from && parseInt(ctx.query.from),
            to: ctx.query.to && parseInt(ctx.query.to)
        };

        if (isValid) {
            try {
                const mtxs = await this.transactionService.getMetasByAddress(addr);
                if (mtxs && mtxs.length > 0) {
                    const result = MappingService.mapGetAddress(addr, mtxs, this.node.chain.height, options);
                    ctx.body = result;
                    ctx.status = 200;
                } else {
                    ctx.body = new ErrorMessage('No transactions on address');
                    ctx.status = 404;
                }
            }
            catch (e) {
                console.error(e);
                ctx.body = new ErrorMessage('Internal server error');
                ctx.status = 500;
            }
        } else {
            ctx.body = new ErrorMessage('Address is not valid');
            ctx.status = 400;
        }
    }


    async getAddressBalance(ctx, next) {
        await this.getAddressInfo(ctx, next);
        ctx.body = ctx.body.balanceSat;
    }

    async getAddressTotalReceived(ctx, next) {
        await this.getAddressInfo(ctx, next);
        ctx.body = ctx.body.totalReceivedSat;
    }

    async getAddressTotalSent(ctx, next) {
        await this.getAddressInfo(ctx, next);
        ctx.body = ctx.body.totalSentSat;
    }

    async getAddressUnconfirmedBalance(ctx, next) {
        await this.getAddressInfo(ctx, next);
        ctx.body = ctx.body.unconfirmedBalanceSat;
    }

    async getAddressUnspentOutputs(ctx, next) {
        let addr = ctx.params.address;

        const isValid = ValidationUtils.validateAddress(addr);
        if (isValid) {
            const address = Utils.addrStrToAddress(addr);
            const coins = await this.addressService.getCoinsByAddress(address);

            const result = MappingService.mapGetUTXOsByAddress(coins, this.node.chain.height);
            ctx.body = result;
            ctx.status = 200;

        } else {
            ctx.body = new ErrorMessage('Address is not valid');
            ctx.status = 400;
        }
    }

    async getAddressesUnspentOutputs(ctx, next) {
        let addressesStr = ctx.params.addresses;

        if (ctx.req.method === 'POST') {
            addressesStr = ctx.request.body['addrs'];
        }

        if (!addressesStr) {
            ctx.body = new ErrorMessage('No addresses was specified');
            ctx.status = 400;
            return next();
        }

        if (addressesStr.indexOf(',') !== -1) {
            const addrs = addressesStr.split(',').filter(addr => addr.length > 0);
            const isValid = addrs.every(address => ValidationUtils.validateAddress(address));
            if (isValid) {
                const addresses = addrs.map(addr => Utils.addrStrToAddress(addr));
                let coins = await this.addressService.getCoinsByAddress(addresses);
                const result = MappingService.mapGetUTXOsByAddress(coins, this.node.chain.height);
                ctx.body = result;
                ctx.status = 200;
            } else {
                ctx.body = new ErrorMessage('Addresses is not valid');
                ctx.status = 400;
            }
        } else {
            ctx.params.address = addressesStr;
            await this.getAddressUnspentOutputs(ctx, next);
        }
    }
}

module.exports = AddressController;