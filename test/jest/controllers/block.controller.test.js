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


describe('Get blockHash test [/block-index/:height]', () => {

    test('Get hash of genesis block', async () => {
        const response = await request(app.callback()).get('/block-index/0');

        expect(response.status).toEqual(200);
        expect(response.body).toEqual({"blockHash": "000000000933ea01ad0ee984209779baaec3ced90fa3f408719526f8d77f4943"})
    });

    test('Get block #500', async () => {
        const response = await request(app.callback()).get('/block-index/500');

        expect(response.status).toEqual(200);
        expect(response.body).toEqual({"blockHash": "00000000a2424460c992803ed44cfe0c0333e91af04fde9a6a97b468bf1b5f70"})
    });


    test('Get block #100000', async () => {
        const response = await request(app.callback()).get('/block-index/100000');

        expect(response.status).toEqual(200);
        expect(response.body).toEqual({"blockHash": "00000000009e2958c15ff9290d571bf9459e93b19765c6801ddeccadbb160a1e"})
    });


    test('Get block #1000000', async () => {
        const response = await request(app.callback()).get('/block-index/1000000');

        expect(response.status).toEqual(200);
        expect(response.body).toEqual({"blockHash": "0000000000478e259a3eda2fafbeeb0106626f946347955e99278fe6cc848414"})
    });

    test('Get block with negative height', async () => {
        const response = await request(app.callback()).get('/block-index/-1');

        expect(response.status).toEqual(400);
        expect(response.body).toEqual({"message": "Block index (height) is not valid"})
    });

    test('Get block with invalid height (chars)', async () => {
        const response = await request(app.callback()).get('/block-index/zzzzzzz');

        expect(response.status).toEqual(400);
        expect(response.body).toEqual({"message": "Block index (height) is not valid"})
    });

    test('Get block with unexisted height', async () => {
        const response = await request(app.callback()).get('/block-index/999999999');

        expect(response.status).toEqual(404);
        expect(response.body).toEqual({"message": "Block not found"})
    });
});

