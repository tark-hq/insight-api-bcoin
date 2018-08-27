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

    test('Get block #500', async () => {
        const response = await request(app.callback()).get('/block/00000000a2424460c992803ed44cfe0c0333e91af04fde9a6a97b468bf1b5f70');

        const expected = {
            "hash": "00000000a2424460c992803ed44cfe0c0333e91af04fde9a6a97b468bf1b5f70",
            "size": 1868,
            "height": 500,
            "version": 1,
            "merkleroot": "dd3f288510dd3b632940bd3fb1db162d3ff99b19ddb0c586cfa3ac9a76d42517",
            "tx": ["a647d0c4112b4727f3c856782ff6bbaf099be929b27214a8e0dfedee4383eb68", "24b8a4c788b8c805b810438ddd99e569e184ff20f4394ac49a6d832e69f57242", "c5ffd70c3bc4998465cef55ed6d5d831ab3a550406423eb611117ed8ee41c278", "4692772a73ea834c836915089acf97f2c790380a2b8fd32f82729da72545d8c5", "82d6d88081e3e0eb36730f7f3aedb17228142b9e00a6dbaab4b53b798d0742c1", "fc407d7a3b819daa5cf1ecc2c2a4b103c3782104d1425d170993bd534779a0da", "95ad3ffb2a9426d6f5f5b97a134d90153ae16c9375f74eb385f481cff2771d77"],
            "time": 1296746771,
            "nonce": 2325411586,
            "bits": "1d00ffff",
            "difficulty": 1,
            "chainwork": "000000000000000000000000000000000000000000000000000001f501f501f5",
            "confirmations": 1409556,
            "previousblockhash": "000000008cd4b1bdaa1278e3f1708258f862da16858324e939dc650627cd2e27",
            "nextblockhash": "00000000c7f50b6dfac8b8a59e11b7e62f07fdef20597089b9c5d64ebfe6d682",
            "reward": 50.003,
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


    test('Get block #100000', async () => {
        const response = await request(app.callback()).get('/block/00000000009e2958c15ff9290d571bf9459e93b19765c6801ddeccadbb160a1e');

        const expected = {
            "hash": "00000000009e2958c15ff9290d571bf9459e93b19765c6801ddeccadbb160a1e",
            "size": 221,
            "height": 100000,
            "version": 2,
            "merkleroot": "d574f343976d8e70d91cb278d21044dd8a396019e6db70755a0a50e4783dba38",
            "tx": ["d574f343976d8e70d91cb278d21044dd8a396019e6db70755a0a50e4783dba38"],
            "time": 1376123972,
            "nonce": 1005240617,
            "bits": "1c00f127",
            "difficulty": 271.75767392888963,
            "chainwork": "000000000000000000000000000000000000000000000000004144cfce43f5e8",
            "confirmations": 1310057,
            "previousblockhash": "000000004956cc2edd1a8caa05eacfa3c69f4c490bfc9ace820257834115ab35",
            "nextblockhash": "0000000000629d100db387f37d0f37c51118f250fb0946310a8c37316cbc4028",
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


    test('Get block #1000000', async () => {
        const response = await request(app.callback()).get('/block/0000000000478e259a3eda2fafbeeb0106626f946347955e99278fe6cc848414');

        const expected = {
            "hash": "0000000000478e259a3eda2fafbeeb0106626f946347955e99278fe6cc848414",
            "size": 293,
            "height": 1000000,
            "version": 536870912,
            "merkleroot": "09afbaf60152b867782f35a202b935b6a20362e68812bd31fbaf6859939c200b",
            "tx": ["09afbaf60152b867782f35a202b935b6a20362e68812bd31fbaf6859939c200b"],
            "time": 1476873476,
            "nonce": 2673201105,
            "bits": "1b52ccc0",
            "difficulty": 791.487374243693,
            "chainwork": "000000000000000000000000000000000000000000000017e96a5df21f269acc",
            "confirmations": 410062,
            "previousblockhash": "00000000002208a5fee5b9baa4b5519d2cd8ab405754fca13704dc667448f21a",
            "nextblockhash": "00000000001f32e60b480ce145a5b359bbc5e07f391eec4e4b13c03a273c28f9",
            "reward": 3.125,
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


    test('Get block with invalid block hash (z chars)', async () => {
        const response = await request(app.callback()).get('/block/zzzzzzzzzzzzz');

        expect(response.status).toEqual(400);
        expect(response.body.message).toEqual('Block hash is not valid');
    });


    test('Get block with unexisted blockHash', async () => {
        //just random sha256
        const response = await request(app.callback()).get('/block/cb0de486b3ce22e57eb8e8dd9218c67102887c508ccc29b8bb8f5ee2aa228816');

        expect(response.status).toEqual(404);
        expect(response.body.message).toEqual('Block not found');
    });

    test('Get block without param', async () => {
        const response = await request(app.callback()).get('/block/');
        expect(response.status).toEqual(404);
    });

});
