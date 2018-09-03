const app = require('../../../app');
const request = require('supertest');
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

        const expected = {"addrStr":"mgYrJQYubixiBDUYT7xBRoJcsEEsnS9Ncb","balance":0.0028,"balanceSat":280000,"totalReceived":0.0028,"totalReceivedSat":280000,"totalSent":0,"totalSentSat":0,"unconfirmedBalance":0,"unconfirmedBalanceSat":0,"unconfirmedTxApperances":0,"txApperances":1,"transactions":["f3ea8a564822fbeb0ceb952864f06331b4659eaae743aef9a19b79d1505536ac"]};

        expect(response.status).toEqual(200);
        expect(response.body).toEqual(expected)
    });

    test('Get address mgYrJQYubixiBDUYT7xBRoJcsEEsnS9Ncb without txList', async () => {
        const response = await request(app.callback()).get('/addr/mgYrJQYubixiBDUYT7xBRoJcsEEsnS9Ncb?noTxList=1');

        const expected = {"addrStr":"mgYrJQYubixiBDUYT7xBRoJcsEEsnS9Ncb","balance":0.0028,"balanceSat":280000,"totalReceived":0.0028,"totalReceivedSat":280000,"totalSent":0,"totalSentSat":0,"unconfirmedBalance":0,"unconfirmedBalanceSat":0,"unconfirmedTxApperances":0,"txApperances":1};

        expect(response.status).toEqual(200);
        expect(response.body).toEqual(expected)
    });

    test('Get address mmHx7xA9E4uZdYLiq6ACccNzDfPwm15Cuv', async () => {
        const response = await request(app.callback()).get('/addr/mmHx7xA9E4uZdYLiq6ACccNzDfPwm15Cuv');

        const expected = {"addrStr":"mmHx7xA9E4uZdYLiq6ACccNzDfPwm15Cuv","balance":0,"balanceSat":0,"totalReceived":2.71561522,"totalReceivedSat":271561522,"totalSent":2.71561522,"totalSentSat":271561522,"unconfirmedBalance":0,"unconfirmedBalanceSat":0,"unconfirmedTxApperances":0,"txApperances":2,"transactions":["4b40c2b1fb9eafc0a55d293725288ca2cc930ad19968066ea798a926f5af121b","8d2ac2cbccf34d9c9caec3241dfa81a743988fcb68603cdaef853456bd701c78"]};

        expect(response.status).toEqual(200);
        expect(response.body).toEqual(expected)
    });

    test('Get invalid address (number) ', async () => {
        const response = await request(app.callback()).get('/addr/123123');

        expect(response.status).toEqual(400);
        expect(response.body.message).toEqual("Address is not valid")
    });


    test('Get invalid address (chars) ', async () => {
        const response = await request(app.callback()).get('/addr/zzzzzzzz');

        expect(response.status).toEqual(400);
        expect(response.body.message).toEqual("Address is not valid")
    });

    test('Get valid address but no txs', async () => {
        const response = await request(app.callback()).get('/addr/2MuWP39vEw7dcdtzRwcbaBGrh4DQdjoaega');

        expect(response.status).toEqual(404);
        expect(response.body.message).toEqual("No transactions on address")
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
        expect(response.body).toEqual(expected)
    });

});


describe('Get getAddressInfo/totalReceived test [/addr/:address/totalReceived]', () => {

    test('Get address mgYrJQYubixiBDUYT7xBRoJcsEEsnS9Ncb', async () => {
        const response = await request(app.callback()).get('/addr/mgYrJQYubixiBDUYT7xBRoJcsEEsnS9Ncb/totalReceived');

        const expected = 280000;

        expect(response.status).toEqual(200);
        expect(response.body).toEqual(expected)
    });

});


describe('Get getAddressInfo/totalSent test [/addr/:address/totalSent]', () => {

    test('Get address mgYrJQYubixiBDUYT7xBRoJcsEEsnS9Ncb', async () => {
        const response = await request(app.callback()).get('/addr/mgYrJQYubixiBDUYT7xBRoJcsEEsnS9Ncb/totalSent');

        const expected = 0;

        expect(response.status).toEqual(200);
        expect(response.body).toEqual(expected)
    });

});


describe('Get getAddressInfo/unconfirmedBalance test [/addr/:address/unconfirmedBalance]', () => {

    test('Get address mgYrJQYubixiBDUYT7xBRoJcsEEsnS9Ncb', async () => {
        const response = await request(app.callback()).get('/addr/mgYrJQYubixiBDUYT7xBRoJcsEEsnS9Ncb/unconfirmedBalance');

        const expected = 0;

        expect(response.status).toEqual(200);
        expect(response.body).toEqual(expected)
    });

});

