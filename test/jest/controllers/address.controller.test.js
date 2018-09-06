const app = require('../../../app');
const request = require('supertest');
const testUtils = require('../utils/test.utils');
const ignoring = testUtils.ignoring;
global.app = app;


beforeAll(async () => {
    console.log('Starting server');
    await global.app.startApp();
});

afterAll(async () => {
    await global.app.stopApp();
});


describe('Get getAddressInfo test [/addr/:address]', () => {

    test('Get address mgYrJQYubixiBDUYT7xBRoJcsEEsnS9Ncb', async () => {
        const response = await request(app.callback()).get('/addr/mgYrJQYubixiBDUYT7xBRoJcsEEsnS9Ncb');

        const expected = {
            'addrStr': 'mgYrJQYubixiBDUYT7xBRoJcsEEsnS9Ncb',
            'balance': 0.0028,
            'balanceSat': 280000,
            'totalReceived': 0.0028,
            'totalReceivedSat': 280000,
            'totalSent': 0,
            'totalSentSat': 0,
            'unconfirmedBalance': 0,
            'unconfirmedBalanceSat': 0,
            'unconfirmedTxApperances': 0,
            'txApperances': 1,
            'transactions': ['f3ea8a564822fbeb0ceb952864f06331b4659eaae743aef9a19b79d1505536ac']
        };

        expect(response.status).toEqual(200);
        expect(response.body).toEqual(expected);
    });

    test('Get address mgYrJQYubixiBDUYT7xBRoJcsEEsnS9Ncb without txList', async () => {
        const response = await request(app.callback()).get('/addr/mgYrJQYubixiBDUYT7xBRoJcsEEsnS9Ncb?noTxList=1');

        const expected = {
            'addrStr': 'mgYrJQYubixiBDUYT7xBRoJcsEEsnS9Ncb',
            'balance': 0.0028,
            'balanceSat': 280000,
            'totalReceived': 0.0028,
            'totalReceivedSat': 280000,
            'totalSent': 0,
            'totalSentSat': 0,
            'unconfirmedBalance': 0,
            'unconfirmedBalanceSat': 0,
            'unconfirmedTxApperances': 0,
            'txApperances': 1
        };

        expect(response.status).toEqual(200);
        expect(response.body).toEqual(expected);
    });

    test('Get address mmHx7xA9E4uZdYLiq6ACccNzDfPwm15Cuv', async () => {
        const response = await request(app.callback()).get('/addr/mmHx7xA9E4uZdYLiq6ACccNzDfPwm15Cuv');

        const expected = {
            'addrStr': 'mmHx7xA9E4uZdYLiq6ACccNzDfPwm15Cuv',
            'balance': 0,
            'balanceSat': 0,
            'totalReceived': 2.71561522,
            'totalReceivedSat': 271561522,
            'totalSent': 2.71561522,
            'totalSentSat': 271561522,
            'unconfirmedBalance': 0,
            'unconfirmedBalanceSat': 0,
            'unconfirmedTxApperances': 0,
            'txApperances': 2,
            'transactions': ['4b40c2b1fb9eafc0a55d293725288ca2cc930ad19968066ea798a926f5af121b', '8d2ac2cbccf34d9c9caec3241dfa81a743988fcb68603cdaef853456bd701c78']
        };

        expect(response.status).toEqual(200);
        expect(response.body).toEqual(expected);
    });

    test('Get invalid address (number) ', async () => {
        const response = await request(app.callback()).get('/addr/123123');

        expect(response.status).toEqual(400);
        expect(response.body.message).toEqual('Address is not valid');
    });


    test('Get invalid address (chars) ', async () => {
        const response = await request(app.callback()).get('/addr/zzzzzzzz');

        expect(response.status).toEqual(400);
        expect(response.body.message).toEqual('Address is not valid');
    });

    test('Get valid address but no txs', async () => {
        const response = await request(app.callback()).get('/addr/2MuWP39vEw7dcdtzRwcbaBGrh4DQdjoaega');

        expect(response.status).toEqual(404);
        expect(response.body.message).toEqual('No transactions on address');
    });


    test('Get address info without param ', async () => {
        const response = await request(app.callback()).get('/addr/');

        expect(response.status).toEqual(404);
    });

});


describe('Get getAddressInfo/balance test [/addr/:address/balance]', () => {

    test('Get address mgYrJQYubixiBDUYT7xBRoJcsEEsnS9Ncb', async () => {
        const response = await request(app.callback()).get('/addr/mgYrJQYubixiBDUYT7xBRoJcsEEsnS9Ncb/balance');

        const expected = 280000;

        expect(response.status).toEqual(200);
        expect(response.body).toEqual(expected);
    });

});


describe('Get getAddressInfo/totalReceived test [/addr/:address/totalReceived]', () => {

    test('Get address mgYrJQYubixiBDUYT7xBRoJcsEEsnS9Ncb', async () => {
        const response = await request(app.callback()).get('/addr/mgYrJQYubixiBDUYT7xBRoJcsEEsnS9Ncb/totalReceived');

        const expected = 280000;

        expect(response.status).toEqual(200);
        expect(response.body).toEqual(expected);
    });

});


describe('Get getAddressInfo/totalSent test [/addr/:address/totalSent]', () => {

    test('Get address mgYrJQYubixiBDUYT7xBRoJcsEEsnS9Ncb', async () => {
        const response = await request(app.callback()).get('/addr/mgYrJQYubixiBDUYT7xBRoJcsEEsnS9Ncb/totalSent');

        const expected = 0;

        expect(response.status).toEqual(200);
        expect(response.body).toEqual(expected);
    });

});


describe('Get getAddressInfo/unconfirmedBalance test [/addr/:address/unconfirmedBalance]', () => {

    test('Get address mgYrJQYubixiBDUYT7xBRoJcsEEsnS9Ncb', async () => {
        const response = await request(app.callback()).get('/addr/mgYrJQYubixiBDUYT7xBRoJcsEEsnS9Ncb/unconfirmedBalance');

        const expected = 0;

        expect(response.status).toEqual(200);
        expect(response.body).toEqual(expected);
    });

});

describe('Get getAddressUnspentOutputs test [/addr/:address/utxo]', () => {

    test('Get address mgYrJQYubixiBDUYT7xBRoJcsEEsnS9Ncb', async () => {
        const response = await request(app.callback()).get('/addr/mgYrJQYubixiBDUYT7xBRoJcsEEsnS9Ncb/utxo');

        const expected = [{
            'address': 'mgYrJQYubixiBDUYT7xBRoJcsEEsnS9Ncb',
            'txid': 'f3ea8a564822fbeb0ceb952864f06331b4659eaae743aef9a19b79d1505536ac',
            'vout': 1,
            'scriptPubKey': '76a9140b53f448eba75639c312f9c3ea8b70d5ba3dd6de88ac',
            'amount': 0.0028,
            'satoshis': 280000,
            'height': 1381913,
            'confirmations': 30588
        }];

        expect(response.status).toEqual(200);
        expect(ignoring(response.body, ['confirmations'])).toEqual(ignoring(expected, ['confirmations']));
    });

    test('Get invalid address (chars)', async () => {
        const response = await request(app.callback()).get('/addr/zzzzz/utxo');

        expect(response.status).toEqual(400);

    });

});

describe('Get getAddressesUnspentOutputs test [/addrs/:addresses/utxo]', () => {

    test('Get address mgYrJQYubixiBDUYT7xBRoJcsEEsnS9Ncb,mtUGPXnLZaSZCtoVjiYpdhbDXuEjSe8NLS', async () => {
        const response = await request(app.callback()).get('/addrs/mgYrJQYubixiBDUYT7xBRoJcsEEsnS9Ncb,mtUGPXnLZaSZCtoVjiYpdhbDXuEjSe8NLS/utxo');

        const expected = [{
            'address': 'mgYrJQYubixiBDUYT7xBRoJcsEEsnS9Ncb',
            'txid': 'f3ea8a564822fbeb0ceb952864f06331b4659eaae743aef9a19b79d1505536ac',
            'vout': 1,
            'scriptPubKey': '76a9140b53f448eba75639c312f9c3ea8b70d5ba3dd6de88ac',
            'amount': 0.0028,
            'satoshis': 280000,
            'height': 1381913,
            'confirmations': 30588
        }, {
            'address': 'mtUGPXnLZaSZCtoVjiYpdhbDXuEjSe8NLS',
            'txid': 'e5aa6d87360af04605cdad632026494684eea26107195438a6241ce963f0bc2a',
            'vout': 0,
            'scriptPubKey': '76a9148e177de564adc2755471f07eed5582ecfc1fcd6688ac',
            'amount': 0.0028,
            'satoshis': 280000,
            'height': 1382213,
            'confirmations': 30288
        }];

        expect(response.status).toEqual(200);
        expect(ignoring(response.body, ['confirmations'])).toEqual(ignoring(expected, ['confirmations']));
    });

    test('Get invalid address (chars)', async () => {
        const response = await request(app.callback()).get('/addr/zzzzz/utxo');

        expect(response.status).toEqual(400);
    });

    test('Get one address is invalid', async () => {
        const response = await request(app.callback()).get('/addrs/mgYrJQYubixiBDUYT7xBRoJcsEEsnS9Ncb,mtUGPXnLZasdsadasfa/utxo');

        expect(response.status).toEqual(400);
    });


    test('Get two addresses with comma at end', async () => {
        const response = await request(app.callback()).get('/addrs/mgYrJQYubixiBDUYT7xBRoJcsEEsnS9Ncb,mtUGPXnLZaSZCtoVjiYpdhbDXuEjSe8NLS,/utxo');

        const expected = [{
            'address': 'mgYrJQYubixiBDUYT7xBRoJcsEEsnS9Ncb',
            'txid': 'f3ea8a564822fbeb0ceb952864f06331b4659eaae743aef9a19b79d1505536ac',
            'vout': 1,
            'scriptPubKey': '76a9140b53f448eba75639c312f9c3ea8b70d5ba3dd6de88ac',
            'amount': 0.0028,
            'satoshis': 280000,
            'height': 1381913,
            'confirmations': 30588
        }, {
            'address': 'mtUGPXnLZaSZCtoVjiYpdhbDXuEjSe8NLS',
            'txid': 'e5aa6d87360af04605cdad632026494684eea26107195438a6241ce963f0bc2a',
            'vout': 0,
            'scriptPubKey': '76a9148e177de564adc2755471f07eed5582ecfc1fcd6688ac',
            'amount': 0.0028,
            'satoshis': 280000,
            'height': 1382213,
            'confirmations': 30288
        }];

        expect(response.status).toEqual(200);
        expect(ignoring(response.body, ['confirmations'])).toEqual(ignoring(expected, ['confirmations']));
    });

});


describe('POST getAddressesUnspentOutputs test [/addrs/utxo]', () => {

    test('POST address mgYrJQYubixiBDUYT7xBRoJcsEEsnS9Ncb', async () => {
        const response = await request(app.callback()).post('/addrs/utxo').send({addrs:'mgYrJQYubixiBDUYT7xBRoJcsEEsnS9Ncb'});

        const expected = [{
            'address': 'mgYrJQYubixiBDUYT7xBRoJcsEEsnS9Ncb',
            'txid': 'f3ea8a564822fbeb0ceb952864f06331b4659eaae743aef9a19b79d1505536ac',
            'vout': 1,
            'scriptPubKey': '76a9140b53f448eba75639c312f9c3ea8b70d5ba3dd6de88ac',
            'amount': 0.0028,
            'satoshis': 280000,
            'height': 1381913,
            'confirmations': 30588
        }];

        expect(response.status).toEqual(200);
        expect(ignoring(response.body, ['confirmations'])).toEqual(ignoring(expected, ['confirmations']));
    });

    test('POST invalid address (chars)', async () => {
        const response = await request(app.callback()).post('/addrs/utxo').send({addrs:'zzzzz'});

        expect(response.status).toEqual(400);
    });

    test('Get one address is invalid', async () => {
        const response = await request(app.callback()).post('/addrs/utxo').send({addrs:'mgYrJQYubixiBDUYT7xBRoJcsEEsnS9Ncb,mtUGPXnLZasdsadasfa'});

        expect(response.status).toEqual(400);
    });


    test('Get two addresses with comma at end', async () => {
        const response = await request(app.callback()).post('/addrs/utxo').send({addrs:'mgYrJQYubixiBDUYT7xBRoJcsEEsnS9Ncb,mtUGPXnLZaSZCtoVjiYpdhbDXuEjSe8NLS,'});

        const expected = [{
            'address': 'mgYrJQYubixiBDUYT7xBRoJcsEEsnS9Ncb',
            'txid': 'f3ea8a564822fbeb0ceb952864f06331b4659eaae743aef9a19b79d1505536ac',
            'vout': 1,
            'scriptPubKey': '76a9140b53f448eba75639c312f9c3ea8b70d5ba3dd6de88ac',
            'amount': 0.0028,
            'satoshis': 280000,
            'height': 1381913,
            'confirmations': 30588
        }, {
            'address': 'mtUGPXnLZaSZCtoVjiYpdhbDXuEjSe8NLS',
            'txid': 'e5aa6d87360af04605cdad632026494684eea26107195438a6241ce963f0bc2a',
            'vout': 0,
            'scriptPubKey': '76a9148e177de564adc2755471f07eed5582ecfc1fcd6688ac',
            'amount': 0.0028,
            'satoshis': 280000,
            'height': 1382213,
            'confirmations': 30288
        }];

        expect(response.status).toEqual(200);
        expect(ignoring(response.body, ['confirmations'])).toEqual(ignoring(expected, ['confirmations']));
    });

});

