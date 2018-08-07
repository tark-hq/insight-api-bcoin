const AddressService = require('../service/address.service');

class AddressController {

    /**
     *
     * @param node {FullNode} bcoin's full node
     */
    constructor(node) {
        if (!node) {
            throw new Error("Bcoin {Fullnode} expected as dependency")
        }

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
            console.log(`[${new Date()}] Collecting summary info about ${addr}`);
            let result = await this.addressService.getTransactionsByAddress(addr);
            ctx.body = result;
            ctx.status = 200;
        } else {
            ctx.body = new Error('No address provided');
            ctx.status = 400;
        }
    }
}

module.exports = AddressController;