const Koa = require('koa');
const app = new Koa();
const bcoin = require('bcoin');
const config = require('./config.json');
const version = require('./package').version;
const Router = require('koa-router');

//controllers
const AddressController = require('./app/controllers/AddressController');
const BlockController = require('./app/controllers/BlockController');
const TransactionController = require('./app/controllers/TransactionController');

console.log(`Starting insight-api-bcoin v${version}`);

initComponents()
    .then(() => {
        console.log('Application initialized');
        app.listen(3000)
    })
    .catch((e) => {
        console.log('er', e);
        process.exit(1)
    });


async function initComponents() {
    console.log('Initializing components');

    async function initBcoinNode() {
        config.memory = false;
        config['index-tx'] = true;
        config['index-address'] = true;
        const node = new bcoin.FullNode(config);

        console.log('Starting Bcoin node');
        await node.open();
        console.log('Connecting to network');
        await node.connect();

        node.on('connect', (entry, block) => {
            console.log('%s (%d) added to chain.', entry.rhash(), entry.height);
        });

        node.on('tx', (tx) => {
            //console.log('%s added to mempool.', tx.txid());
        });

        console.log('Starting sync');
        node.startSync();
        return node;
    }


    async function initKoa(node) {

        const addressController = new AddressController(node);
        const blockController = new BlockController(node);
        const transactionController = new TransactionController(node);

        // logger
        app.use(async (ctx, next) => {
            await next();
            const rt = ctx.response.get('X-Response-Time');
            console.log(`${ctx.method} ${ctx.url} - ${rt}`);
        });

        // x-response-time

        app.use(async (ctx, next) => {
            const start = Date.now();
            await next();
            const ms = Date.now() - start;
            ctx.set('X-Response-Time', `${ms}ms`);
        });

        // response

        const router = new Router();

        router
            //Blocks
            .get('/block-index/:height', blockController.getBlockHash)
            .get('/block/:blockHash', blockController.getBlock)
            .get('/rawBlock/:blockHashOrHeight', blockController.getRawBlock)

            //Transactions
            .get('/tx/:txid', transactionController.getTransaction)
            .get('/rawtx/:txid', transactionController.getRawTransaction)

            //Address
            .get('/addr/:address', addressController.getAddressInfo)
            .get('/addr/:address/balance', addressController.getAddressBalance)
            .get('/addr/:address/totalReceived', addressController.getAddressBalance)
            .get('/addr/:address/totalSent', addressController.getAddressBalance)
            .get('/addr/:address/unconfirmedBalance', addressController.getAddressBalance)
            .get('/addr/:address/utxo', addressController.getAddressUnspentOutputs);


        app
            .use(router.routes())
            .use(router.allowedMethods());
    }

    let node = await initBcoinNode();
    await initKoa(node)
}