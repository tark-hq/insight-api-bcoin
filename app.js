const Koa = require('koa');
const app = new Koa();
const bodyParser = require('koa-bodyparser');
const bcoin = require('bcoin');
const config = require('./config.json');
const version = require('./package').version;
const Router = require('koa-router');

//controllers
const AddressController = require('./app/controllers/AddressController');
const BlockController = require('./app/controllers/BlockController');
const TransactionController = require('./app/controllers/TransactionController');

const PORT = 3000;

let _app = null;

async function startApp() {
    console.log(`Starting insight-api-bcoin v${version}`);

    async function setupBcoinNode() {
        config.memory = false;
        config['index-tx'] = true;
        config['index-address'] = true;
        config['index-outpoint'] = true;

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


    async function setupKoa(node) {

        const addressController = new AddressController(node);
        const blockController = new BlockController(node);
        const transactionController = new TransactionController(node);

        //Body parser
        app.use(bodyParser());

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
            .get('/txs/', transactionController.getTransactionsByBlockHashOrAddress)

            //Address
            .get('/addr/:address', addressController.getAddressInfo)
            .get('/addr/:address/balance', addressController.getAddressBalance)
            .get('/addr/:address/totalReceived', addressController.getAddressBalance)
            .get('/addr/:address/totalSent', addressController.getAddressBalance)
            .get('/addr/:address/unconfirmedBalance', addressController.getAddressBalance)
            .get('/addr/:address/utxo', addressController.getAddressUnspentOutputs)
            .get('/addrs/:addresses/utxo', addressController.getAddressesUnspentOutputs)
            .post('/addrs/utxo', addressController.getAddressesUnspentOutputs);

        app

            .use(router.routes())
            .use(router.allowedMethods());


        _app = app.listen(PORT);

        _app.stopBcoin = async () => {
            node.stopSync();
            await node.close();
        };
    }

    console.log('Initializing components');
    const node = await setupBcoinNode();
    await setupKoa(node)
}

async function stopApp() {
    if (!_app) {
        throw new Error("App is not initialized")
    }
    await _app.close();
    await _app.stopBcoin();
}

if (process.env.NODE_ENV !== 'test') {
    startApp()
        .then(() => {
            console.log('Application initialized');
        })
        .catch((e) => {
            console.log('er', e);
            process.exit(1)
        });
}

app.startApp = startApp;
app.stopApp = stopApp;
module.exports = app;
