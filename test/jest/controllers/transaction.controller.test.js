const app = require('../../../app');
const request = require('supertest');
const omitDeep = require('omit-deep');
const tx_020d3d = require('./expects/tx_020d3d');
const tx_f3ea8a = require('./expects/tx_f3ea8a');
const tx_74a79a = require('./expects/tx_74a79a');
const tx_d822cf4 = require('./expects/tx_d822cf4');
const tx_517c1b = require('./expects/tx_517c1b');
const tx_d2359a = require('./expects/tx_d2359a');
const txs_block_000000000ee8a5ff = require('./expects/txs_block_000000000ee8a5fff7cebf031648bb56821f5ec77aba9c52829cd0fe2e3cc26e');
const txs_block_00000000a90269b2 = require('./expects/txs_block_00000000a90269b293a023104412897d8e9ef0b6fcbd2b4fa694f8b0d9ea9a8f');
global.app = app;


beforeAll(async () => {
    console.log('Starting server');
    await global.app.startApp();
});

afterAll(async () => {
    await global.app.stopApp();
});


describe('Get transaction test [/tx/:txid]', () => {

    test('Get transaction f3ea8a564822fbeb0ceb952864f06331b4659eaae743aef9a19b79d1505536ac', async () => {
        let response = await request(app.callback()).get('/tx/f3ea8a564822fbeb0ceb952864f06331b4659eaae743aef9a19b79d1505536ac');

        let expected = tx_f3ea8a;

        expect(response.status).toEqual(200);

        expect(typeof response.body.confirmations === 'number').toBeTruthy();
        expect(response.body.confirmations).toBeGreaterThanOrEqual(0);

        expect(ignoring(response.body, ['confirmations', 'asm', 'doubleSpentTxID']))
            .toEqual(ignoring(expected, ['confirmations', 'asm', 'doubleSpentTxID']));
    });

    test('Get transaction 020d3df275eb882c0119732c2a6a7e756aed7a7a5ba480dcfab396cb66820d4b', async () => {
        let response = await request(app.callback()).get('/tx/020d3df275eb882c0119732c2a6a7e756aed7a7a5ba480dcfab396cb66820d4b');

        let expected = tx_020d3d;

        expect(response.status).toEqual(200);

        expect(typeof response.body.confirmations === 'number').toBeTruthy();
        expect(response.body.confirmations).toBeGreaterThanOrEqual(0);

        expect(ignoring(response.body, ['confirmations', 'asm', 'doubleSpentTxID']))
            .toEqual(ignoring(expected, ['confirmations', 'asm', 'doubleSpentTxID']));
    });

    test('Get transaction 74a79af4438404a55783e23077bfb0ad40c1c8c2ea584c2779ef4cdb31831819', async () => {
        let response = await request(app.callback()).get('/tx/74a79af4438404a55783e23077bfb0ad40c1c8c2ea584c2779ef4cdb31831819');

        let expected = tx_74a79a;

        expect(response.status).toEqual(200);

        expect(typeof response.body.confirmations === 'number').toBeTruthy();
        expect(response.body.confirmations).toBeGreaterThanOrEqual(0);

        expect(ignoring(response.body, ['confirmations', 'asm', 'doubleSpentTxID']))
            .toEqual(ignoring(expected, ['confirmations', 'asm', 'doubleSpentTxID']));
    });


    test('Get transaction d822cf4687fac2dad39d8c8bc0bacf929334b69e673ff5496a3e9b1fcb219039', async () => {
        let response = await request(app.callback()).get('/tx/d822cf4687fac2dad39d8c8bc0bacf929334b69e673ff5496a3e9b1fcb219039');

        let expected = tx_d822cf4;

        expect(response.status).toEqual(200);

        expect(typeof response.body.confirmations === 'number').toBeTruthy();
        expect(response.body.confirmations).toBeGreaterThanOrEqual(0);

        expect(ignoring(response.body, ['confirmations', 'asm', 'doubleSpentTxID']))
            .toEqual(ignoring(expected, ['confirmations', 'asm', 'doubleSpentTxID']));
    });

    test('Get transaction invalid transaction id (chars)', async () => {
        let response = await request(app.callback()).get('/tx/zzzzz');

        expect(response.status).toEqual(400);
        expect(response.body.message).toEqual('Txid is not valid');

    });

    test('Get transaction invalid transaction id (random sha256)', async () => {
        let response = await request(app.callback()).get('/tx/96c5fe264e9015ce925039aa84c6afefaf56180bc31950f3b1b7583e70137eee');


        expect(response.status).toEqual(404);
        expect(response.body.message).toEqual('Tx not found');

    });

    test('Get transaction without param', async () => {
        let response = await request(app.callback()).get('/tx/');

        expect(response.status).toEqual(404);
    });

});


describe('Get rawtransaction test [/rawTx/:txid]', () => {

    test('Get rawTransaction f3ea8a564822fbeb0ceb952864f06331b4659eaae743aef9a19b79d1505536ac', async () => {
        let response = await request(app.callback()).get('/rawTx/f3ea8a564822fbeb0ceb952864f06331b4659eaae743aef9a19b79d1505536ac');

        let expected = {'rawtx': '010000000359a77a97855d84875ed7d9c915d4c6000310a7139bbff7127bca5579e774e6f3030000006b483045022100bbf15d99a1f192e2203b427bf2c0abb64722667979413920fca263b82d53b9b20220213d6a0fb1c5fda05bd4677e50b2176eecda104b027d92a51027c756ace95ae10121020962443863c93df1ae033b9b0c3dcf3640fb66775db5bd4ad9dbdf782607bcb7ffffffff59a77a97855d84875ed7d9c915d4c6000310a7139bbff7127bca5579e774e6f3040000006b483045022100cc0357bab22c98d7e4f3d9c7a5d1a191378d61297b4749ffb5cdbbe5aa8a5cf602204dfd51713cb9789656fca54ee6f3e9b897c41104b5a0ed1e5d1cb35052dfbf36012103e32c39329d4fb00169b7171f98e825201438ef3e0ec7d27e0c15032ef9c27c90ffffffff59a77a97855d84875ed7d9c915d4c6000310a7139bbff7127bca5579e774e6f3050000006a4730440220749ca78c00ebeff29dda365db63cd1146355c95a794e7f0ed6b6da6407ff0f9d022074cfa9cf5f4cb57ea91a54906709a913e6f73e736279b002028f10b3cdd154d401210302eb9c7818653b65a27f07bcfd37afb66956f3ca0065db66bd81a39c44b73533ffffffff06c0450400000000001976a914078b588b8eed2c357d9143d32aa3c1cb38f1586388acc0450400000000001976a9140b53f448eba75639c312f9c3ea8b70d5ba3dd6de88acc0450400000000001976a914c1c284e27f7fb7891cac0b945c3414657b67986e88acc0d32e06000000001976a914c48663ff53e151cc6f3bd0704261c8aa87294b1088ac4aad000a000000001976a9149ca19c88c9b549471ae2bb96b1d64121477315a588aca022320b000000001976a9145dc87a59436e433145385a6c0a752fd8279b77b688ac00000000'};

        expect(response.status).toEqual(200);
        expect(response.body).toEqual(expected);
    });

    test('Get rawTransaction 020d3df275eb882c0119732c2a6a7e756aed7a7a5ba480dcfab396cb66820d4b', async () => {
        let response = await request(app.callback()).get('/rawTx/020d3df275eb882c0119732c2a6a7e756aed7a7a5ba480dcfab396cb66820d4b');

        let expected = {'rawtx': '01000000012fc6164be932cba392b4d86ca98b567894ce9ec53b610a8c9ebadd377c316bc800000000fdfd000047304402202adea7aed9def6eac2f9014d96b4bbb45b525e191cb220db1d155abaf8cda101022070d32a7e1ccbecf7b73167bffd9181e8ff1f525acd4791fec6692810b92ba09901483045022100a800003f110277eccfcca2252483a1191886f2f4815c3b6ca158c737c1cd2ee602205aca525e71cf8d052565226a9a5eb610c0a4f79c2b2017e6e17b3261254ac4b2014c6952210306993226177621d49bc05157d8e03fbe25f27b41a85135f863499407a206f8ca2102007578f3fa5240f3d1528976043bd14a91906db0c559ab292b5af4fbb6b95c6421037cae832dea43e5403d18b2493ee56a6751c7ed22353b1d0fbba956ba1f1557e653aeffffffff02809698000000000017a9142ed7faf123405b036963b817a1b64ec1493c403187e20a2c000000000017a914320a65d5d6d0abdc12fa280c5dfe157f661d468f8700000000'};

        expect(response.status).toEqual(200);
        expect(response.body).toEqual(expected);
    });

    test('Get rawTransaction 020d3df275eb882c0119732c2a6a7e756aed7a7a5ba480dcfab396cb66820d4b', async () => {
        let response = await request(app.callback()).get('/rawTx/020d3df275eb882c0119732c2a6a7e756aed7a7a5ba480dcfab396cb66820d4b');

        const expected = {'rawtx': '01000000012fc6164be932cba392b4d86ca98b567894ce9ec53b610a8c9ebadd377c316bc800000000fdfd000047304402202adea7aed9def6eac2f9014d96b4bbb45b525e191cb220db1d155abaf8cda101022070d32a7e1ccbecf7b73167bffd9181e8ff1f525acd4791fec6692810b92ba09901483045022100a800003f110277eccfcca2252483a1191886f2f4815c3b6ca158c737c1cd2ee602205aca525e71cf8d052565226a9a5eb610c0a4f79c2b2017e6e17b3261254ac4b2014c6952210306993226177621d49bc05157d8e03fbe25f27b41a85135f863499407a206f8ca2102007578f3fa5240f3d1528976043bd14a91906db0c559ab292b5af4fbb6b95c6421037cae832dea43e5403d18b2493ee56a6751c7ed22353b1d0fbba956ba1f1557e653aeffffffff02809698000000000017a9142ed7faf123405b036963b817a1b64ec1493c403187e20a2c000000000017a914320a65d5d6d0abdc12fa280c5dfe157f661d468f8700000000'};

        expect(response.status).toEqual(200);
        expect(response.body).toEqual(expected);
    });


    test('Get rawTransaction d822cf4687fac2dad39d8c8bc0bacf929334b69e673ff5496a3e9b1fcb219039', async () => {
        let response = await request(app.callback()).get('/rawTx/d822cf4687fac2dad39d8c8bc0bacf929334b69e673ff5496a3e9b1fcb219039');

        let expected = {'rawtx': '01000000010000000000000000000000000000000000000000000000000000000000000000ffffffff1c0301d91300000000006266676d696e657220352e342e320003000000ffffffff017079a804000000001976a914f3b40cad194d48398755b45036421b1a645bbdcc88ac00000000'};

        expect(response.status).toEqual(200);
        expect(response.body).toEqual(expected);
    });

    test('Get transaction invalid transaction id (chars)', async () => {
        let response = await request(app.callback()).get('/tx/zzzzz');


        expect(response.status).toEqual(400);
        expect(response.body.message).toEqual('Txid is not valid');

    });

    test('Get transaction invalid transaction id (random sha256)', async () => {
        let response = await request(app.callback()).get('/rawTx/96c5fe264e9015ce925039aa84c6afefaf56180bc31950f3b1b7583e70137eee');


        expect(response.status).toEqual(404);
        expect(response.body.message).toEqual('Raw Tx not found');

    });

    test('Get transaction without param', async () => {
        let response = await request(app.callback()).get('/rawTx/');

        expect(response.status).toEqual(404);
    });

});

describe('Get transactions by blockHash or address test [/txs/?[block\\address=...]]', () => {

    test('Get transactions by block 000000000ee8a5fff7cebf031648bb56821f5ec77aba9c52829cd0fe2e3cc26e', async () => {
        let response = await request(app.callback()).get('/txs/?block=000000000ee8a5fff7cebf031648bb56821f5ec77aba9c52829cd0fe2e3cc26e');

        let expected = txs_block_000000000ee8a5ff;

        expect(response.status).toEqual(200);
        expect(ignoring(response.body, ['confirmations', 'asm', 'doubleSpentTxID']))
            .toEqual(ignoring(expected, ['confirmations', 'asm', 'doubleSpentTxID']));
    });

    test('Get transactions by block 00000000a90269b293a023104412897d8e9ef0b6fcbd2b4fa694f8b0d9ea9a8f', async () => {
        let response = await request(app.callback()).get('/txs/?block=00000000a90269b293a023104412897d8e9ef0b6fcbd2b4fa694f8b0d9ea9a8f');

        let expected = txs_block_00000000a90269b2;

        expect(response.status).toEqual(200);
        expect(ignoring(response.body, ['confirmations', 'asm', 'doubleSpentTxID']))
            .toEqual(ignoring(expected, ['confirmations', 'asm', 'doubleSpentTxID']));
    });


    test('Get transactions by invalid blockHash (chars)', async () => {
        let response = await request(app.callback()).get('/txs/?block=zzzzzz');

        expect(response.status).toEqual(400);
        expect(response.body.message).toEqual('Blockhash is not valid');

    });

    test('Get transactions by null blockHash', async () => {
        let response = await request(app.callback()).get('/txs/?block=');

        expect(response.status).toEqual(404);
    });


    test('Get transactions by height instead of hash', async () => {
        let response = await request(app.callback()).get('/txs/?block=123');

        expect(response.status).toEqual(400);
        expect(response.body.message).toEqual('Blockhash is not valid');
    });

});


function ignoring(obj, fieldNames) {
    return omitDeep(obj, fieldNames);
}