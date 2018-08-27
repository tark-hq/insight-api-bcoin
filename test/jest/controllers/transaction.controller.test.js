const app = require('../../../app');
const request = require('supertest');
const tx_020d3d = require('./expects/tx_020d3d');
const tx_f3ea8a = require('./expects/tx_f3ea8a');
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
        //we have tested its the number, removing field
        delete expected.confirmations;
        delete response.body.confirmations;

        //difference between different bcoin versions, bitcore uses older version
        //also, doubleSpentTxID is always null in insight api (unimplemented option)
        expected.vin = expected.vin.map(vinElem => {
            //todo fix asm
            delete vinElem.scriptSig.asm;
            delete vinElem.doubleSpentTxID;
            return vinElem;
        });

        response.body.vin = response.body.vin.map(vinElem => {
            delete vinElem.scriptSig.asm;
            return vinElem;
        });


        expect(response.body).toEqual(expected);
    });


    test('Get transaction 020d3df275eb882c0119732c2a6a7e756aed7a7a5ba480dcfab396cb66820d4b', async () => {
        let response = await request(app.callback()).get('/tx/020d3df275eb882c0119732c2a6a7e756aed7a7a5ba480dcfab396cb66820d4b');

        let expected = tx_020d3d;

        expect(response.status).toEqual(200);

        expect(typeof response.body.confirmations === 'number').toBeTruthy();
        expect(response.body.confirmations).toBeGreaterThanOrEqual(0);
        //we have tested its the number, removing field
        delete expected.confirmations;
        delete response.body.confirmations;

        //difference between different bcoin versions, bitcore uses older version
        //also, doubleSpentTxID is always null in insight api (unimplemented option)
        expected.vin = expected.vin.map(vinElem => {
            //todo fix asm
            delete vinElem.scriptSig.asm;
            delete vinElem.doubleSpentTxID;
            return vinElem;
        });

        response.body.vin = response.body.vin.map(vinElem => {
            delete vinElem.scriptSig.asm;
            return vinElem;
        });

        expect(response.body).toEqual(expected);
    });
});
