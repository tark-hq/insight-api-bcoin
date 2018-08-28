const app = require('../../../app');
const request = require('supertest');
const tx_020d3d = require('./expects/tx_020d3d');
const tx_f3ea8a = require('./expects/tx_f3ea8a');
const tx_74a79a = require('./expects/tx_74a79a');
const tx_d822cf4 = require('./expects/tx_d822cf4');
const tx_517c1b = require('./expects/tx_517c1b');
const tx_d2359a = require('./expects/tx_d2359a');
global.app = app;


beforeAll(async () => {
    console.log('Starting server');
    await global.app.startApp();
});

afterAll(async () => {
    await global.app.stopApp();
});


function fixVinFields(responseBody, expected) {
    //difference between different bcoin versions, bitcore uses older version
    //also, doubleSpentTxID is always null in insight api (unimplemented option)
    expected.vin = expected.vin.map(vinElem => {
        //todo fix asm
        if (vinElem.scriptSig) {
            delete vinElem.scriptSig.asm;
        }
        delete vinElem.doubleSpentTxID;
        return vinElem;
    });

    responseBody.vin = responseBody.vin.map(vinElem => {
        //todo fix asm
        if (vinElem.scriptSig) {
            delete vinElem.scriptSig.asm;
        }
        return vinElem;
    });

}

function removeField(fieldName, responseBody, expected) {
    delete expected[fieldName];
    delete responseBody[fieldName];
}


describe('Get transaction test [/tx/:txid]', () => {

    test('Get transaction f3ea8a564822fbeb0ceb952864f06331b4659eaae743aef9a19b79d1505536ac', async () => {
        let response = await request(app.callback()).get('/tx/f3ea8a564822fbeb0ceb952864f06331b4659eaae743aef9a19b79d1505536ac');

        let expected = tx_f3ea8a;

        expect(response.status).toEqual(200);

        expect(typeof response.body.confirmations === 'number').toBeTruthy();
        expect(response.body.confirmations).toBeGreaterThanOrEqual(0);

        //we have tested its the number, removing field
        removeField('confirmations', response.body, expected);

        //removing some unstable fields
        fixVinFields(response.body, expected);

        expect(response.body).toEqual(expected);
    });

    test('Get transaction 020d3df275eb882c0119732c2a6a7e756aed7a7a5ba480dcfab396cb66820d4b', async () => {
        let response = await request(app.callback()).get('/tx/020d3df275eb882c0119732c2a6a7e756aed7a7a5ba480dcfab396cb66820d4b');

        let expected = tx_020d3d;

        expect(response.status).toEqual(200);

        expect(typeof response.body.confirmations === 'number').toBeTruthy();
        expect(response.body.confirmations).toBeGreaterThanOrEqual(0);

        //we have tested its the number, removing field
        removeField('confirmations', response.body, expected);

        //removing some unstable fields
        fixVinFields(response.body, expected);

        expect(response.body).toEqual(expected);
    });

    test('Get transaction 74a79af4438404a55783e23077bfb0ad40c1c8c2ea584c2779ef4cdb31831819', async () => {
        let response = await request(app.callback()).get('/tx/74a79af4438404a55783e23077bfb0ad40c1c8c2ea584c2779ef4cdb31831819');

        let expected = tx_74a79a;

        expect(response.status).toEqual(200);

        expect(typeof response.body.confirmations === 'number').toBeTruthy();
        expect(response.body.confirmations).toBeGreaterThanOrEqual(0);

        //we have tested its the number, removing field
        removeField('confirmations', response.body, expected);

        //removing some unstable fields
        fixVinFields(response.body, expected);

        expect(response.body).toEqual(expected);
    });


    test('Get transaction d822cf4687fac2dad39d8c8bc0bacf929334b69e673ff5496a3e9b1fcb219039', async () => {
        let response = await request(app.callback()).get('/tx/d822cf4687fac2dad39d8c8bc0bacf929334b69e673ff5496a3e9b1fcb219039');

        let expected = tx_d822cf4;

        expect(response.status).toEqual(200);

        expect(typeof response.body.confirmations === 'number').toBeTruthy();
        expect(response.body.confirmations).toBeGreaterThanOrEqual(0);

        //we have tested its the number, removing field
        removeField('confirmations', response.body, expected);

        //removing some unstable fields
        fixVinFields(response.body, expected);

        expect(response.body).toEqual(expected);
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
