const AddressService = require('../service/address.service');
const MappingService = require('../service/mapping.service');
const ValidationUtils = require('../util/validation.utils');
const ErrorMessage = require('../model/ErrorMessage');

class AddressController {

    /**
     *
     * @param node {FullNode} bcoin's full node
     */
    constructor(node) {
        if (!node) {
            throw new Error("Bcoin {Fullnode} expected as dependency")
        }

        this.node = node;

        this.addressService = new AddressService(node);

        this.getAddressInfo = this.getAddressInfo.bind(this);
    }


    /**
     *
     * @param ctx {Object} koa's ctx
     * @param next {Function}
     */
    async getAddressInfo(ctx, next) {
        let addr = ctx.params.address;
        if (addr) {
            const isValid = ValidationUtils.validateAddress(addr);
            if (isValid) {
                try {
                    const txs = await this.addressService.getTransactionsByAddress(addr, true);
                    const mtxs = await this.addressService.getMetasByAddress(addr);
                    if (txs && txs.length > 0) {
                        const result = MappingService.mapGetAddress(addr, mtxs, txs, this.node.chain.height);
                        ctx.body = result;
                        ctx.status = 200;
                    } else {
                        ctx.body = new ErrorMessage('Not found');
                        ctx.status = 404;
                    }
                }
                catch (e) {
                    ctx.body = new ErrorMessage('Internal server error');
                    ctx.status = 500;
                }
            } else {
                ctx.body = new ErrorMessage('Address is not valid');
                ctx.status = 400;
            }
        } else {
            ctx.body = new Error('No address provided');
            ctx.status = 400;
        }
    }
}

module.exports = AddressController;