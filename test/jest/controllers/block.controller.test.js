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


describe('Get block method [/block/:blockHash]', () => {

    test('Get genesis block', async () => {
        const response = await request(app.callback()).get('/block/000000000933ea01ad0ee984209779baaec3ced90fa3f408719526f8d77f4943');

        const expected = {
            "hash": "000000000933ea01ad0ee984209779baaec3ced90fa3f408719526f8d77f4943",
            "size": 285,
            "height": 0,
            "version": 1,
            "merkleroot": "4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b",
            "tx": ["4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b"],
            "time": 1296688602,
            "nonce": 414098458,
            "bits": "1d00ffff",
            "difficulty": 1,
            "chainwork": "0000000000000000000000000000000000000000000000000000000100010001",
            "confirmations": 1408780,
            "previousblockhash": null,
            "nextblockhash": "00000000b873e79784647a6c82962c70d228557d24a747ea4d1b8bbe878e1206",
            "reward": 50,
            "isMainChain": true,
            "poolInfo": {}
        };

        expect(response.status).toEqual(200);
        expect(response.body.hash).toEqual(expected.hash);
        expect(response.body.size).toEqual(expected.size);
        expect(response.body.height).toEqual(expected.height);
        expect(response.body.version).toEqual(expected.version);
        expect(response.body.merkleroot).toEqual(expected.merkleroot);
        expect(response.body.tx).toEqual(expected.tx);
        expect(response.body.time).toEqual(expected.time);
        expect(response.body.nonce).toEqual(expected.nonce);
        expect(response.body.bits).toEqual(expected.bits);
        expect(response.body.difficulty).toEqual(expected.difficulty);
        expect(response.body.chainwork).toEqual(expected.chainwork);
        expect(typeof response.body.confirmations === 'number').toBeTruthy();
        expect(response.body.confirmations).toBeGreaterThanOrEqual(0);
        expect(response.body.previousblockhash).toEqual(expected.previousblockhash);
        expect(response.body.nextblockhash).toEqual(expected.nextblockhash);
        expect(response.body.reward).toEqual(expected.reward);
        expect(response.body.isMainChain).toEqual(expected.isMainChain);
        expect(response.body.poolInfo).toEqual(expected.poolInfo);
    });
});
