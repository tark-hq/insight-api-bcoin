const app = require('../../../app');
const request = require('supertest');
const ignoring = require('../utils/test.utils').ignoring;
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


describe('Get rawBlock method [/rawBlock/:blockHeightOrHash]', () => {

    test('Get genesis raw block by hash', async () => {
        const response = await request(app.callback()).get('/rawBlock/000000000933ea01ad0ee984209779baaec3ced90fa3f408719526f8d77f4943');

        const expected = {"rawblock": "0100000000000000000000000000000000000000000000000000000000000000000000003ba3edfd7a7b12b27ac72c3e67768f617fc81bc3888a51323a9fb8aa4b1e5e4adae5494dffff001d1aa4ae180101000000010000000000000000000000000000000000000000000000000000000000000000ffffffff4d04ffff001d0104455468652054696d65732030332f4a616e2f32303039204368616e63656c6c6f72206f6e206272696e6b206f66207365636f6e64206261696c6f757420666f722062616e6b73ffffffff0100f2052a01000000434104678afdb0fe5548271967f1a67130b7105cd6a828e03909a67962e0ea1f61deb649f6bc3f4cef38c4f35504e51ec112de5c384df7ba0b8d578a4c702b6bf11d5fac00000000"};

        expect(response.status).toEqual(200);
        expect(response.body).toEqual(expected);
    });


    test('Get genesis raw block by height', async () => {
        const response = await request(app.callback()).get('/rawBlock/0');

        const expected = {"rawblock": "0100000000000000000000000000000000000000000000000000000000000000000000003ba3edfd7a7b12b27ac72c3e67768f617fc81bc3888a51323a9fb8aa4b1e5e4adae5494dffff001d1aa4ae180101000000010000000000000000000000000000000000000000000000000000000000000000ffffffff4d04ffff001d0104455468652054696d65732030332f4a616e2f32303039204368616e63656c6c6f72206f6e206272696e6b206f66207365636f6e64206261696c6f757420666f722062616e6b73ffffffff0100f2052a01000000434104678afdb0fe5548271967f1a67130b7105cd6a828e03909a67962e0ea1f61deb649f6bc3f4cef38c4f35504e51ec112de5c384df7ba0b8d578a4c702b6bf11d5fac00000000"};

        expect(response.status).toEqual(200);
        expect(response.body).toEqual(expected);
    });


    test('Get rawblock #500 by hash', async () => {
        const response = await request(app.callback()).get('/rawBlock/00000000a2424460c992803ed44cfe0c0333e91af04fde9a6a97b468bf1b5f70');

        const expected = {"rawblock": "01000000272ecd270665dc39e924838516da62f8588270f1e37812aabdb1d48c000000001725d4769aaca3cf86c5b0dd199bf93f2d16dbb13fbd4029633bdd1085283fdd13c94a4dffff001d02f79a8a0701000000010000000000000000000000000000000000000000000000000000000000000000ffffffff2e8df2f07d823540b28637aa1213984c50e101fa05b323c0f7cc3abf9b5d77826a65082418520bf083345d6db36c65ffffffff01e0850a2a010000002321029f5fcb9ab3f1514d54dc3afb9eb8bae104954109f4c63783372f58905af593f8ac000000000100000001f38ca301420a9d7b483fd435fa977044a2cd209535ca6c98e252a9aeaa068746000000006c49304602210098efd2b7a859e48b4e0ffe09734f0bc10ed177251aa19f1e32e5cca9eb28aa4702210095604e030d0837b2c4ffe0e05b576d5ec3527ff03838b9001a0ce5aa4e91465701210360eee686423502e035b7193ff2295ce1b1af8c5af79f1d6c2c9eca1a41a58330ffffffff0217aada1f010000001976a914a54487b586f59868b2553bf2dbe990130a88806188ac4d9f0e000000000017a914995ebf5d9e37056113bf56b5893b44af2a4b418f8700000000010000000258bd81fd34d42c015ac22537440c49450453e8284b717667c418ed7dc3693579010000006c493046022100f487e0587d3cbab20f151801b35493be6f7722a9906b88e464541440f0e5456b022100a2541b0ede9de1e453c98e56825179ea47d4f6a3b406db0b8f84b8a4caaafcf3012103223850b5215f24bbf8159783918f70f7d5b13039bffb48dda6d048d1bac2bc59ffffffff5ec32b4e2bcd54aaba906f0799e64c181d37d22439590671e1b23c0aae5d911c010000006a473044022006c185fe3edf51798f0cf5aac7c3ce79b7025d7e5d07f36de236b6b88f9385ec02205e58ea566fa742f7faa6a350e08ba144172db55caa7dd43fffb158e22d4ef4dd012102e110738e9b9bdd224db085cdb3425f71961e424b613edc7711ceb612aae6d01affffffff027e471100000000001976a914890d266a26875f8d496c5b54777ceae9fd56167188ace0a605000000000017a91409ed617253305fd33492b743c09d538902a0188b870000000001000000023f2dc10288706fe1c3116bec01dc2a259bfc2802b60d9b13787195fa8205f0cf000000006b48304502203ef5c34af08cd2865820757844ac079e081e7b41bf427ac896f41ab12a9f9857022100bd0914548145648ec538c088640228baaa983a7c78fbf49526c5c30358fe0f54012103420f2cb862c7a77d7b2376660573eb6976f01f59222892dd16326ee7ef37fc5bffffffff3f4ba67c7517df51e39ee8da832ee176e27f861fe013e4089e4dbcf609146639000000006a47304402201468bcfff3b1d8bdd0ba5fd94692c4dc7766411bdafe8d65b6e7a5be8f7efa8602207cdcbe3a107db271f24d7d8ac83a887ef4a1b72c910cc9ea5627b4cf37e87bcf0121025f9a9951e2d2a3037c1af09d9789b84a5776c504cd5b59bccd469124eb59835fffffffff0249b71000000000001976a914ad7d7b9ac5260ad13fa55e06143283f5b36495f788ac5d700300000000001976a914bc0f9f5fc9dc55323d52a9e354b5fb67cecd389788ac0000000001000000014272f5692e836d9ac44a39f420ff84e169e599dd8d4310b805c8b888c7a4b824000000006c493046022100dd60f3c74936fecf65642bfd7fbed6148327996ea3c5a052083bb0b0f1a1c02e022100f6e221b12dbfc46317a716c30dbdbf1e49c96732a815a03e0ee7a0b3cd00fdc70121020f3661affe914966ce072f7eb3962a3d534546de7b721cdd259df1f17e4a4078ffffffff020fecca1f010000001976a9142bd66240c232e8fe3e41dab4e02f8b48cca6287588acb8fa0e000000000017a914d9f26cca817fa116dc76e1be7a17067eb843625087000000000100000001c142078d793bb5b4aadba6009e2b142872b1ed3a7f0f7336ebe0e38180d8d682000000006c4930460221008c17958cf5fd52151c0ab28d64a65dc88d6ac30094b7a342794615cacf98a94b022100db62f7ad812984aab15c386fd70aeefaf09a48f0ce7f6daf9bda76d200b231710121021ea1cc2b09ae07b98cc28a344ac60b8d264edbf6c6e5c451a0b337e8d3ca9aa7ffffffff02fd30c61f010000001976a91435957af4fa5b509bd0648d5388246ce4b696b87988acc2f70300000000001976a914edb1dfaf6e0b39449da811275386edf2eb54baba88ac000000000100000001daa0794753bd9309175d42d1042178c303b1a4c2c2ecf15caa9d813b7a7d40fc000000006b48304502206b492f48a2b8b9a6d0032f021d329e57012e205b6f55c93909caaf7e59c66941022100ff2e3a5940491d0c527b53989de0da5100cda1e90f5f2429b6d6592e9b0d34c80121023374fcd24a709c4503f9a11f2f5bf24d8277b77a267ca76a50aea21b88f236e4ffffffff02db60c11f010000001976a9149c4198b9e2c421a3fdff7b140c965967de9660a388acd20c04000000000017a91409ed617253305fd33492b743c09d538902a0188b8700000000"};
        expect(response.status).toEqual(200);
        expect(response.body).toEqual(expected);
    });


    test('Get rawblock #500 by height', async () => {
        const response = await request(app.callback()).get('/rawBlock/500');

        const expected = {"rawblock": "01000000272ecd270665dc39e924838516da62f8588270f1e37812aabdb1d48c000000001725d4769aaca3cf86c5b0dd199bf93f2d16dbb13fbd4029633bdd1085283fdd13c94a4dffff001d02f79a8a0701000000010000000000000000000000000000000000000000000000000000000000000000ffffffff2e8df2f07d823540b28637aa1213984c50e101fa05b323c0f7cc3abf9b5d77826a65082418520bf083345d6db36c65ffffffff01e0850a2a010000002321029f5fcb9ab3f1514d54dc3afb9eb8bae104954109f4c63783372f58905af593f8ac000000000100000001f38ca301420a9d7b483fd435fa977044a2cd209535ca6c98e252a9aeaa068746000000006c49304602210098efd2b7a859e48b4e0ffe09734f0bc10ed177251aa19f1e32e5cca9eb28aa4702210095604e030d0837b2c4ffe0e05b576d5ec3527ff03838b9001a0ce5aa4e91465701210360eee686423502e035b7193ff2295ce1b1af8c5af79f1d6c2c9eca1a41a58330ffffffff0217aada1f010000001976a914a54487b586f59868b2553bf2dbe990130a88806188ac4d9f0e000000000017a914995ebf5d9e37056113bf56b5893b44af2a4b418f8700000000010000000258bd81fd34d42c015ac22537440c49450453e8284b717667c418ed7dc3693579010000006c493046022100f487e0587d3cbab20f151801b35493be6f7722a9906b88e464541440f0e5456b022100a2541b0ede9de1e453c98e56825179ea47d4f6a3b406db0b8f84b8a4caaafcf3012103223850b5215f24bbf8159783918f70f7d5b13039bffb48dda6d048d1bac2bc59ffffffff5ec32b4e2bcd54aaba906f0799e64c181d37d22439590671e1b23c0aae5d911c010000006a473044022006c185fe3edf51798f0cf5aac7c3ce79b7025d7e5d07f36de236b6b88f9385ec02205e58ea566fa742f7faa6a350e08ba144172db55caa7dd43fffb158e22d4ef4dd012102e110738e9b9bdd224db085cdb3425f71961e424b613edc7711ceb612aae6d01affffffff027e471100000000001976a914890d266a26875f8d496c5b54777ceae9fd56167188ace0a605000000000017a91409ed617253305fd33492b743c09d538902a0188b870000000001000000023f2dc10288706fe1c3116bec01dc2a259bfc2802b60d9b13787195fa8205f0cf000000006b48304502203ef5c34af08cd2865820757844ac079e081e7b41bf427ac896f41ab12a9f9857022100bd0914548145648ec538c088640228baaa983a7c78fbf49526c5c30358fe0f54012103420f2cb862c7a77d7b2376660573eb6976f01f59222892dd16326ee7ef37fc5bffffffff3f4ba67c7517df51e39ee8da832ee176e27f861fe013e4089e4dbcf609146639000000006a47304402201468bcfff3b1d8bdd0ba5fd94692c4dc7766411bdafe8d65b6e7a5be8f7efa8602207cdcbe3a107db271f24d7d8ac83a887ef4a1b72c910cc9ea5627b4cf37e87bcf0121025f9a9951e2d2a3037c1af09d9789b84a5776c504cd5b59bccd469124eb59835fffffffff0249b71000000000001976a914ad7d7b9ac5260ad13fa55e06143283f5b36495f788ac5d700300000000001976a914bc0f9f5fc9dc55323d52a9e354b5fb67cecd389788ac0000000001000000014272f5692e836d9ac44a39f420ff84e169e599dd8d4310b805c8b888c7a4b824000000006c493046022100dd60f3c74936fecf65642bfd7fbed6148327996ea3c5a052083bb0b0f1a1c02e022100f6e221b12dbfc46317a716c30dbdbf1e49c96732a815a03e0ee7a0b3cd00fdc70121020f3661affe914966ce072f7eb3962a3d534546de7b721cdd259df1f17e4a4078ffffffff020fecca1f010000001976a9142bd66240c232e8fe3e41dab4e02f8b48cca6287588acb8fa0e000000000017a914d9f26cca817fa116dc76e1be7a17067eb843625087000000000100000001c142078d793bb5b4aadba6009e2b142872b1ed3a7f0f7336ebe0e38180d8d682000000006c4930460221008c17958cf5fd52151c0ab28d64a65dc88d6ac30094b7a342794615cacf98a94b022100db62f7ad812984aab15c386fd70aeefaf09a48f0ce7f6daf9bda76d200b231710121021ea1cc2b09ae07b98cc28a344ac60b8d264edbf6c6e5c451a0b337e8d3ca9aa7ffffffff02fd30c61f010000001976a91435957af4fa5b509bd0648d5388246ce4b696b87988acc2f70300000000001976a914edb1dfaf6e0b39449da811275386edf2eb54baba88ac000000000100000001daa0794753bd9309175d42d1042178c303b1a4c2c2ecf15caa9d813b7a7d40fc000000006b48304502206b492f48a2b8b9a6d0032f021d329e57012e205b6f55c93909caaf7e59c66941022100ff2e3a5940491d0c527b53989de0da5100cda1e90f5f2429b6d6592e9b0d34c80121023374fcd24a709c4503f9a11f2f5bf24d8277b77a267ca76a50aea21b88f236e4ffffffff02db60c11f010000001976a9149c4198b9e2c421a3fdff7b140c965967de9660a388acd20c04000000000017a91409ed617253305fd33492b743c09d538902a0188b8700000000"};
        expect(response.status).toEqual(200);
        expect(response.body).toEqual(expected);
    });

    test('Get rawblock #100000 by hash', async () => {
        const response = await request(app.callback()).get('/rawBlock/00000000009e2958c15ff9290d571bf9459e93b19765c6801ddeccadbb160a1e');

        const expected = {"rawblock": "0200000035ab154183570282ce9afc0b494c9fc6a3cfea05aa8c1add2ecc56490000000038ba3d78e4500a5a7570dbe61960398add4410d278b21cd9708e6d9743f374d544fc055227f1001c29c1ea3b0101000000010000000000000000000000000000000000000000000000000000000000000000ffffffff3703a08601000427f1001c046a510100522cfabe6d6d0000000000000000000068692066726f6d20706f6f6c7365727665726aac1eeeed88ffffffff0100f2052a010000001976a914912e2b234f941f30b18afbb4fa46171214bf66c888ac00000000"};
        expect(response.status).toEqual(200);
        expect(response.body).toEqual(expected);
    });
    test('Get rawblock #100000 by height', async () => {
        const response = await request(app.callback()).get('/rawBlock/100000');

        const expected = {"rawblock": "0200000035ab154183570282ce9afc0b494c9fc6a3cfea05aa8c1add2ecc56490000000038ba3d78e4500a5a7570dbe61960398add4410d278b21cd9708e6d9743f374d544fc055227f1001c29c1ea3b0101000000010000000000000000000000000000000000000000000000000000000000000000ffffffff3703a08601000427f1001c046a510100522cfabe6d6d0000000000000000000068692066726f6d20706f6f6c7365727665726aac1eeeed88ffffffff0100f2052a010000001976a914912e2b234f941f30b18afbb4fa46171214bf66c888ac00000000"};
        expect(response.status).toEqual(200);
        expect(response.body).toEqual(expected);
    });

    /* TODO ??? fails
        test('Get block #1000000', async () => {
            const response = await request(app.callback()).get('/rawBlock/0000000000478e259a3eda2fafbeeb0106626f946347955e99278fe6cc848414');

            const expected = {"rawblock": "000000201af2487466dc0437a1fc545740abd82c9d51b5a4bab9e5fea5082200000000000b209c935968affb31bd1288e66203a2b635b902a2352f7867b85201f6baaf09044d0758c0cc521bd1cf559f0101000000010000000000000000000000000000000000000000000000000000000000000000ffffffff2c0340420f00046b40075804f2fb3d0d0cf03807580b000000000000000a636b706f6f6c082f7365677769742fffffffff02205fa012000000001976a914d427a9318bc60db2766f9b02b7bbd470b78fa7a488ac0000000000000000266a24aa21a9ede2f61c3f71d1defd3fa999dfa36953755c690689799962b48bebd836974e8cf900000000"};
            expect(response.status).toEqual(200);
            expect(response.body).toEqual(expected);
        });*/


    test('Get rawblock with invalid block hash (z chars)', async () => {
        const response = await request(app.callback()).get('/rawBlock/zzzzzzzzzzzzz');

        expect(response.status).toEqual(400);
        expect(response.body.message).toEqual('Block hash or height is not valid');
    });

    test('Get rawblock with unexisted blockHash', async () => {
        //just random sha256
        const response = await request(app.callback()).get('/rawBlock/cb0de486b3ce22e57eb8e8dd9218c67102887c508ccc29b8bb8f5ee2aa228816');

        expect(response.status).toEqual(404);
        expect(response.body.message).toEqual('Raw block not found');
    });

    test('Get rawblock with negative height', async () => {
        //just random sha256
        const response = await request(app.callback()).get('/rawBlock/-1');

        expect(response.status).toEqual(400);
        expect(response.body.message).toEqual('Block hash or height is not valid');
    });


    test('Get rawblock without param', async () => {
        const response = await request(app.callback()).get('/rawBlock/');
        expect(response.status).toEqual(404);
    });

});




describe('Get block summaries method [/blocks[?limit=N&blockDate=YYYY-mm-dd] ]', () => {

    test('Get block summaries by date 2017-04-22', async () => {
        const response = await request(app.callback()).get('/blocks?blockDate=2017-04-22');

        const expected = {"blocks":[{"height":1119579,"size":11586,"hash":"00000000000000498d91fe21a18329b44579fca5c996e81a996502eb9ba1d991","time":1492905061,"txlength":29,"poolInfo":{}},{"height":1119578,"size":21666,"hash":"0000000038f15a5bd9131ae8fe607df26a0ba969d724296c7b3b92dae4bf123b","time":1492904105,"txlength":52,"poolInfo":{}},{"height":1119577,"size":8624,"hash":"0000000000000892c852542c399491b1fd0a49795823f2020c8e43e7e5eb9df2","time":1492902900,"txlength":23,"poolInfo":{}},{"height":1119576,"size":5582,"hash":"000000000000093da8573c394023b1b5ac5c01c795f9160d80acb44cbcf994c5","time":1492902270,"txlength":16,"poolInfo":{}},{"height":1119575,"size":5551,"hash":"00000000000003cc44e8960c10ea16d816bb15005d155f00c022480f1b8fc732","time":1492902024,"txlength":13,"poolInfo":{}},{"height":1119574,"size":2172,"hash":"00000000000006793c1c7122d71a6357515ee45a3dbd623e2d04f573ec9dd6cb","time":1492901785,"txlength":7,"poolInfo":{}},{"height":1119573,"size":7843,"hash":"0000000000000be0e6f946277b6e93e1d0bbbad6107b994abc0f7463295c2934","time":1492901728,"txlength":19,"poolInfo":{}},{"height":1119572,"size":15825,"hash":"0000000000000464856fce7a93cffbc266a3998a7ae0089f1c2c0f8d0e60cd3c","time":1492901388,"txlength":43,"poolInfo":{}},{"height":1119571,"size":3856,"hash":"000000000000058d4fb9b5ee75017f69c866eff5635be0f6563d1a10aa147fc3","time":1492900567,"txlength":11,"poolInfo":{}},{"height":1119570,"size":4359,"hash":"0000000000000afcd9fc2c66080b61d7762f48146750588af11337a18d47d404","time":1492900436,"txlength":12,"poolInfo":{}},{"height":1119569,"size":14039,"hash":"000000000000021c8fe0a1e2172bae18436d2b632f1fcaca1aa322e52b98ce5d","time":1492900305,"txlength":39,"poolInfo":{}},{"height":1119568,"size":18535,"hash":"00000000619c5e71050b6afef61fd074f1e663993239f00392ce497515200dae","time":1492899424,"txlength":54,"poolInfo":{}},{"height":1119567,"size":15316,"hash":"00000000000004413d9d13984a5b143af2273f25ce945c6ae3b67ddb9fb20107","time":1492898215,"txlength":33,"poolInfo":{}},{"height":1119566,"size":12547,"hash":"0000000000000a46b5206669df68a4c05858faf1df03f98d930a2d97255ae795","time":1492897443,"txlength":37,"poolInfo":{}},{"height":1119565,"size":13341,"hash":"000000000000019903df805bf66be94a198de9d0261d4885b486f6fb3a248a99","time":1492896669,"txlength":41,"poolInfo":{}},{"height":1119564,"size":19642,"hash":"0000000002d2debf9989acc5d359d9ab7695ed37fd281d293d35dcd36b5d37a6","time":1492895724,"txlength":55,"poolInfo":{}},{"height":1119563,"size":2461,"hash":"000000000000083a0b37ffbe51fd0f2b47972f3923a397dc974f2c2b75a0ae61","time":1492894507,"txlength":8,"poolInfo":{}},{"height":1119562,"size":10029,"hash":"000000000000001512141cbbf9e677925e329eedc2907d357855f0c60aa15ee5","time":1492894326,"txlength":29,"poolInfo":{}},{"height":1119561,"size":1934,"hash":"0000000000000a0e4fc566dd903352005d47c303ee0db36a5b6245624b86d05a","time":1492893545,"txlength":6,"poolInfo":{}},{"height":1119560,"size":7020,"hash":"0000000000000686058a9a6412999c2398d53236a0b77474b82fa0247a706e04","time":1492893425,"txlength":21,"poolInfo":{}},{"height":1119559,"size":26870,"hash":"0000000064b66d3e952634f548928bf2c41ada1442652f5f11cc0e470506e4de","time":1492892984,"txlength":56,"poolInfo":{}},{"height":1119558,"size":4378,"hash":"0000000000000762aa81203141f4cca97825e83efa824f0f632fd04374296ddd","time":1492891779,"txlength":13,"poolInfo":{}},{"height":1119557,"size":4451,"hash":"00000000000009f1441de52058baddef371fbed0a589d9f138e59f21530ea85a","time":1492891632,"txlength":14,"poolInfo":{}},{"height":1119556,"size":9573,"hash":"00000000000005c836de020131411598683439ac0d89a7407621aa514ec95aaf","time":1492891343,"txlength":27,"poolInfo":{}},{"height":1119555,"size":2933,"hash":"00000000000008e62fa2850a0d79087de11e7686122d30ef6beb3bdcdd1b93c1","time":1492890896,"txlength":10,"poolInfo":{}},{"height":1119554,"size":20346,"hash":"0000000070ecb89a887a4bc6f91517b1d6fc385624e433413976f81e0bf91d96","time":1492890596,"txlength":60,"poolInfo":{}},{"height":1119553,"size":15134,"hash":"00000000000006b61cb228cf4d36d712bea3f597bdafc84ecd4e14dcb95db78f","time":1492889381,"txlength":42,"poolInfo":{}},{"height":1119552,"size":9532,"hash":"0000000000000ac720d143dc95881d436cc3ce0c952b8063403a97a8b2d5bdb3","time":1492888376,"txlength":31,"poolInfo":{}},{"height":1119551,"size":16529,"hash":"000000000000047524f266a6e8e22923f380c46ca49d7a66331d17259eca09fe","time":1492887603,"txlength":46,"poolInfo":{}},{"height":1119550,"size":22918,"hash":"00000000771c5310d91ee2c732ff4434eed6a53ed67d175582063dd455573b4a","time":1492886769,"txlength":64,"poolInfo":{}},{"height":1119549,"size":15810,"hash":"000000000000037e133bf6125f20c4c1ab5f5ef3ad118193d47766db744e8252","time":1492885564,"txlength":50,"poolInfo":{}},{"height":1119548,"size":24297,"hash":"00000000ad8c569e4749f901bdc57fb1f90b4c1b6666a6431b58509c1e303c4e","time":1492884854,"txlength":76,"poolInfo":{}},{"height":1119547,"size":14704,"hash":"0000000000000c81bc0f915310c10a566a57654acef50a2f51abde8ff697e1f5","time":1492883646,"txlength":45,"poolInfo":{}},{"height":1119546,"size":10194,"hash":"00000000000000762c1ecedd331a8fc138a60c122951ad27da50aa3dea4fad27","time":1492882749,"txlength":29,"poolInfo":{}},{"height":1119545,"size":1101,"hash":"00000000000000563bc0feca9c471057dff372da33d895eec3f624e03b218481","time":1492882297,"txlength":3,"poolInfo":{}},{"height":1119544,"size":20245,"hash":"000000009e57121d97cb827069ecb6e84da6b422c00a22ba6d4d30c992b10481","time":1492882219,"txlength":62,"poolInfo":{}},{"height":1119543,"size":19858,"hash":"0000000084a81d076de274ae9f5956174099922f0398c29d62ce395b85774a08","time":1492881014,"txlength":61,"poolInfo":{}},{"height":1119542,"size":12838,"hash":"00000000000001505ca0711e2c8c54eb79098e3074878fc91a62e30e920374d6","time":1492879811,"txlength":33,"poolInfo":{}},{"height":1119541,"size":2001,"hash":"00000000000004ef39e2b46777ec7f70f3319df7cb4c724261a0947758ce4ee2","time":1492879065,"txlength":6,"poolInfo":{}},{"height":1119540,"size":21228,"hash":"0000000000000c834590ef7a7043f20ec1abb4036af63c7488b7afac2fa07bb7","time":1492878953,"txlength":42,"poolInfo":{}},{"height":1119539,"size":10296,"hash":"0000000000000c831030b9342dd072f7244c336eecf878d1a38e06b3aea94a48","time":1492877991,"txlength":29,"poolInfo":{}},{"height":1119538,"size":21449,"hash":"00000000000003f86eb61ecb30b5c747344c5ac88f5e35149e847d6bb7f27efa","time":1492877202,"txlength":57,"poolInfo":{}},{"height":1119537,"size":4451,"hash":"0000000000000b2ee9abdb1a82633276c935d71e00b2aa29f544b042509ac489","time":1492876037,"txlength":10,"poolInfo":{}},{"height":1119536,"size":1539,"hash":"00000000000000bed48abd8b5858f1621867789f3e8d6fbbcacff49c7ac4ad8c","time":1492875982,"txlength":5,"poolInfo":{}},{"height":1119535,"size":18549,"hash":"000000000b2fcfe535705232c1bf8f922f95691c407097d94bfed714a44682c2","time":1492875985,"txlength":54,"poolInfo":{}},{"height":1119534,"size":14172,"hash":"0000000000000944c6b9027baee53764403e41de257b5b6a85a28be6f6f8a3a2","time":1492874776,"txlength":41,"poolInfo":{}},{"height":1119533,"size":4565,"hash":"000000000000014114a3b1289810a45d15bbd61593a7c6de4ad94866af6fa5be","time":1492873826,"txlength":11,"poolInfo":{}},{"height":1119532,"size":7653,"hash":"00000000000006167e1bfc675ba7ab438fe302af462aafc6b821f602f2b1c3a8","time":1492873659,"txlength":25,"poolInfo":{}},{"height":1119531,"size":26831,"hash":"0000000013ff86b35c350e5ba2d57e5f4cd4dd91b0f8ff48b409b5e41cbf4933","time":1492873304,"txlength":72,"poolInfo":{}},{"height":1119530,"size":73599,"hash":"00000000168634d6483921d78f3f909ef2e939d38634790495d31eb96be4d9a2","time":1492872099,"txlength":276,"poolInfo":{}},{"height":1119529,"size":22861,"hash":"0000000015af3901c5b72388d6bb6047206e67d71e1f9ec2be18f8ad10d39761","time":1492870894,"txlength":62,"poolInfo":{}},{"height":1119528,"size":16103,"hash":"000000001b8bd3e730a366fe23f61c90fa17b951d3b6a709145b0b6e9920f014","time":1492869679,"txlength":50,"poolInfo":{}},{"height":1119527,"size":10655,"hash":"00000000000003359e0a0ca6efbf28e7206367fe9b4b00be5b239a38a13b6646","time":1492868468,"txlength":26,"poolInfo":{}},{"height":1119526,"size":18600,"hash":"00000000fa1c3ff569468369e0f4703d6b201688cc81e5b5ab35f191217f3bc7","time":1492867774,"txlength":50,"poolInfo":{}},{"height":1119525,"size":12100,"hash":"00000000000001ce01f21c01ae3db3df48f43da2d78dc177d744c5d3088c5cff","time":1492866569,"txlength":33,"poolInfo":{}},{"height":1119524,"size":12267,"hash":"0000000000000b6a8eed19cbb790771a3dd8f0b24137f15ba7d08405884e8ee0","time":1492865819,"txlength":34,"poolInfo":{}},{"height":1119523,"size":645,"hash":"0000000000000afb5582c1d8ab01711306e8c169425b31715a2edee15b733c1f","time":1492865028,"txlength":2,"poolInfo":{}},{"height":1119522,"size":16499,"hash":"00000000000003661471bf6079608d30405480b329e4413641ea8d67a60981ee","time":1492865017,"txlength":42,"poolInfo":{}},{"height":1119521,"size":12041,"hash":"000000000000043ffa4a45b83ff501541f685ad20bc685ee45cef08d2e65e9d6","time":1492863962,"txlength":43,"poolInfo":{}},{"height":1119520,"size":3762,"hash":"00000000000006e8c4cafc263f3227858046104186bb933954408ea9524fef12","time":1492863653,"txlength":12,"poolInfo":{}},{"height":1119519,"size":22224,"hash":"0000000001ea44d8f4d84f43d75772d74ef170776f9f75ef221d44b24904707c","time":1492863399,"txlength":65,"poolInfo":{}},{"height":1119518,"size":18073,"hash":"000000006323e4a835cfa8f102581482f5b962575763fdc6e131e06c8400fbac","time":1492862196,"txlength":56,"poolInfo":{}},{"height":1119517,"size":28691,"hash":"00000000000007200d36dafb11d57a7c4bf284384ced1234e299676b9a23dc97","time":1492860986,"txlength":64,"poolInfo":{}},{"height":1119516,"size":6570,"hash":"0000000000000b48315fc7636e5db0650c7872a43f37176676c1facc58485efd","time":1492860600,"txlength":18,"poolInfo":{}},{"height":1119515,"size":63537,"hash":"0000000055ec3a3c39513d8f8a6a593f36dccb92a210b08a7e9ec42cbabc5d53","time":1492860169,"txlength":253,"poolInfo":{}},{"height":1119514,"size":18043,"hash":"00000000000001d92380fbb53289c37864c50c6af39b9b0ad2626119510448e3","time":1492858964,"txlength":58,"poolInfo":{}},{"height":1119513,"size":10230,"hash":"0000000000000499357b08ea4ef86ae85b8e52abc898abb08758506a3a9002cd","time":1492858286,"txlength":36,"poolInfo":{}},{"height":1119512,"size":41486,"hash":"00000000e6c3a2a0c86e8f7e5dcface4d9121c18a5266aabd6f621ded0cd7a56","time":1492858004,"txlength":80,"poolInfo":{}},{"height":1119511,"size":2747,"hash":"00000000000001b9b90d0c7c7693d7fcc83c2e0d53de24c620d995a957959a34","time":1492856798,"txlength":9,"poolInfo":{}},{"height":1119510,"size":10862,"hash":"00000000000002031c2f468d3f661afec42a8c22fb7c0edb6643f96bc7aa896f","time":1492856714,"txlength":28,"poolInfo":{}},{"height":1119509,"size":18370,"hash":"0000000000000a21926d40d5053846daa6a876368856d91cfed494b65fcf2f78","time":1492856279,"txlength":63,"poolInfo":{}},{"height":1119508,"size":67452,"hash":"0000000045d24ea93597389d58d6b03ea8e7f2e14a63689ac6c2b38b279d458b","time":1492855304,"txlength":264,"poolInfo":{}},{"height":1119507,"size":18985,"hash":"000000000000071eb6afd322c31a89647c23e7a02b73dcea3f2c7b5f11aaef15","time":1492854102,"txlength":56,"poolInfo":{}},{"height":1119506,"size":19330,"hash":"00000000784e72e4315530680f407ca6d31fdf2513dfaed05a321539af0b8a86","time":1492853094,"txlength":58,"poolInfo":{}},{"height":1119505,"size":5320,"hash":"0000000000000b6dc5b34a62d9eb4051a989ffe2564ac9504e1f17f4f17b2078","time":1492851888,"txlength":15,"poolInfo":{}},{"height":1119504,"size":14861,"hash":"0000000000000ac0b78aa724a57e41516d9a6ecaea2522cceae07bad25b5aa47","time":1492851524,"txlength":44,"poolInfo":{}},{"height":1119503,"size":4970,"hash":"00000000000005160bac09c3a310df78ec22f8c6d985d21ddb8ae318c3948ea3","time":1492850461,"txlength":18,"poolInfo":{}},{"height":1119502,"size":8084,"hash":"000000000000084a99d72429e65e3ee3877bcd7dd464b13f1e59ed29bf6c96a3","time":1492850293,"txlength":24,"poolInfo":{}},{"height":1119501,"size":11242,"hash":"00000000000006e4768223bfc6bb7dcbf6f78dfdb6014d13ebd0f57af9726cec","time":1492849791,"txlength":29,"poolInfo":{}},{"height":1119500,"size":15852,"hash":"0000000000000b57d883995ecee7e63ac2e570b094d074bbd20ef73e88a3db79","time":1492849061,"txlength":43,"poolInfo":{}},{"height":1119499,"size":1319,"hash":"000000000000001719aba63b513af2bb90cbffc35fecc5863fca846f873639df","time":1492848015,"txlength":3,"poolInfo":{}},{"height":1119498,"size":10544,"hash":"000000000000069e8b2ba9c99b65e5bd68ccfa4602e41ad9138c5568e1a56d68","time":1492847985,"txlength":30,"poolInfo":{}},{"height":1119497,"size":11334,"hash":"000000000000046db10629e26f06384c961eb541280b84fc2956a19eb67cbea9","time":1492847350,"txlength":31,"poolInfo":{}},{"height":1119496,"size":16004,"hash":"0000000071083cd80038833af8a4f8d93504425ac37ea68800b564774e4290b8","time":1492846289,"txlength":47,"poolInfo":{}},{"height":1119495,"size":15578,"hash":"0000000045d5ee4472ab46d240bec68478ffc26ae593111d7548ed183c8b0607","time":1492845079,"txlength":42,"poolInfo":{}},{"height":1119494,"size":6359,"hash":"00000000000009551e70c175a058d32411fed80a998c508be3cffb162176e148","time":1492843865,"txlength":19,"poolInfo":{}},{"height":1119493,"size":1329,"hash":"000000000000084dcbbbd36214690b5785e602a2639891cc0f25f0ebb05ae6d3","time":1492843463,"txlength":4,"poolInfo":{}},{"height":1119492,"size":4885,"hash":"00000000000005a2841206eb42a772b55fbf42f3277048fc34037e54c81a41d3","time":1492843389,"txlength":16,"poolInfo":{}},{"height":1119491,"size":14518,"hash":"00000000000009795d5da5dcfe3cd71c380f8e7c3a4cf928a5ad0ff7aaef0b33","time":1492843057,"txlength":39,"poolInfo":{}},{"height":1119490,"size":2136,"hash":"0000000000000a78b0465adfd9fafdb316e6d79faed41ed287081b1bb92dd27e","time":1492842141,"txlength":6,"poolInfo":{}},{"height":1119489,"size":3489,"hash":"0000000000000784e9875b5e09450dc19eb98e78f36ae25f6da7c578ecc93dc5","time":1492842034,"txlength":10,"poolInfo":{}},{"height":1119488,"size":18012,"hash":"000000006ecfe059ab7fb890b705e641e29aae8e05117be8235964ad35af04e2","time":1492841891,"txlength":51,"poolInfo":{}},{"height":1119487,"size":5289,"hash":"00000000000002e93cbd74841cfafc2d6a77dcfa84fe6392c2e14df4435de6f1","time":1492840687,"txlength":19,"poolInfo":{}},{"height":1119486,"size":1503,"hash":"0000000000000ca51c42326c9011634b0a6a5f9f5a089d3a9f187ab6b0cf0ab3","time":1492840348,"txlength":4,"poolInfo":{}},{"height":1119485,"size":8327,"hash":"000000000000044d40f0a5232102e6ae5076ed32530bedeba8399826c1225e84","time":1492840287,"txlength":22,"poolInfo":{}},{"height":1119484,"size":18728,"hash":"00000000eeaf2005fae0005e86aff560f8538e2e7a0092c9d4334aa3de2c9f28","time":1492839699,"txlength":58,"poolInfo":{}},{"height":1119483,"size":78402,"hash":"000000000b4629c823b6eb857b412173f5080292139673e5e7072ea2ca886fab","time":1492838491,"txlength":326,"poolInfo":{}},{"height":1119482,"size":2789,"hash":"0000000000000d13ffc9aaa07b009aca7149f78d8eb40f92523636c0f965382c","time":1492837282,"txlength":8,"poolInfo":{}},{"height":1119481,"size":13531,"hash":"000000000000068014966a9629fa1a0aa61c678d9d22b4e3c1220d3542f9a6e7","time":1492837120,"txlength":43,"poolInfo":{}},{"height":1119480,"size":9468,"hash":"00000000000005c95c58423dc7c49024db88741c37d18574d5711935bae24002","time":1492836493,"txlength":27,"poolInfo":{}},{"height":1119479,"size":13073,"hash":"00000000000007af01d7074d4da891d70464c33db726b14ed073b99436d3f243","time":1492835962,"txlength":42,"poolInfo":{}},{"height":1119478,"size":17204,"hash":"00000000d0d220cbcd16fb78f667030fd3bae7e35136ff2a44fe2e64f8097250","time":1492835169,"txlength":51,"poolInfo":{}},{"height":1119477,"size":794,"hash":"00000000000007f7d0ad200f5db2a9181c95b1eae4f72cc0d63ec7242147f19c","time":1492833962,"txlength":2,"poolInfo":{}},{"height":1119476,"size":17458,"hash":"00000000000003bc224d89e6f002b1b85c6874a1b64a5bcdeac848aba87a2340","time":1492833926,"txlength":47,"poolInfo":{}},{"height":1119475,"size":3831,"hash":"00000000000007d60dc589c96802db2ffb686fdd5c9db1dc8961a22043ee9bd4","time":1492833014,"txlength":13,"poolInfo":{}},{"height":1119474,"size":7446,"hash":"0000000000000067d2ea377257633212ab3fbe75904bb0529f50ebda8f34884a","time":1492832869,"txlength":24,"poolInfo":{}},{"height":1119473,"size":3256,"hash":"000000000000016aad2e4c5e90fdbe11c0740fee3e957c20319a1e4770338b0e","time":1492832525,"txlength":11,"poolInfo":{}},{"height":1119472,"size":6001,"hash":"0000000000000608810c48ef81ece74049b6679fbe44e3795fcdd5586c936128","time":1492832389,"txlength":17,"poolInfo":{}},{"height":1119471,"size":12772,"hash":"00000000000007939b80216f9a46b95467104b07771c3786bd980d98c7469521","time":1492831946,"txlength":34,"poolInfo":{}},{"height":1119470,"size":14621,"hash":"000000009364671cf4a55164396a1103b40ccda567df6da49fe91260bc177024","time":1492830818,"txlength":42,"poolInfo":{}},{"height":1119469,"size":13128,"hash":"00000000cdee52b774688fbf64a903ebcc411d5615714911eb096446999be4a7","time":1492829608,"txlength":36,"poolInfo":{}},{"height":1119468,"size":11848,"hash":"0000000000000482d0134e69e2b48e9e8cb565a1336986f546a8f673b033bebd","time":1492828405,"txlength":36,"poolInfo":{}},{"height":1119467,"size":233,"hash":"0000000042564dd26c2f4004751be89d4abc139aea7d53c46ebdd0b3a7d327aa","time":1492828509,"txlength":1,"poolInfo":{}},{"height":1119466,"size":1018,"hash":"0000000000000625fa736e02dfce7784919fc29d6b91815505308692ae969175","time":1492827260,"txlength":3,"poolInfo":{}},{"height":1119465,"size":5633,"hash":"0000000000000387ae481d47db705603566ca0b7353eeb7529ab178b565611ac","time":1492827204,"txlength":15,"poolInfo":{}},{"height":1119464,"size":2328,"hash":"0000000000000857089611d3cc23255ffa2084f427576e4b1e16dd1026708b6b","time":1492826777,"txlength":6,"poolInfo":{}},{"height":1119463,"size":15495,"hash":"00000000c57fb4373a1b1e356dd866ff81f2be32e003023b1c22cc5d97ec49ce","time":1492826624,"txlength":38,"poolInfo":{}},{"height":1119462,"size":14715,"hash":"0000000000000cb2601c3aa19c61320bac8035785016226a66d559b7c5ca0c0e","time":1492825410,"txlength":44,"poolInfo":{}},{"height":1119461,"size":29721,"hash":"000000001ac4ba92d4ae66e323c642483929e1229ed705fc08fc5007537c41f3","time":1492824408,"txlength":64,"poolInfo":{}},{"height":1119460,"size":3034,"hash":"0000000000000136616575ff7a6e0021fcc09b4a123423ddae4ecf39b19a3b96","time":1492823204,"txlength":7,"poolInfo":{}},{"height":1119459,"size":3382,"hash":"0000000000000aad4167c928c3f1bf5893abb5f79ddd4b851e530452669c31b2","time":1492823069,"txlength":11,"poolInfo":{}},{"height":1119458,"size":869,"hash":"00000000000000dd302cb52bf4bf5a438b4e06a1301580e31ecf81ff698c4f66","time":1492822900,"txlength":3,"poolInfo":{}},{"height":1119457,"size":6973,"hash":"00000000000009833d452696e3a6c5edd29f36484c1befdb888f87d4f0e1d8ec","time":1492822828,"txlength":23,"poolInfo":{}},{"height":1119456,"size":26206,"hash":"000000006e071b0927765a86085415d80de40e4d69b05a7894d39a7197520bf4","time":1492822338,"txlength":79,"poolInfo":{}},{"height":1119455,"size":233,"hash":"000000002608f8946925cc2c7e42ee410278679dc1c8c1807370fa80806259b5","time":1492821124,"txlength":1,"poolInfo":{}},{"height":1119454,"size":11641,"hash":"0000000000000747a06685dbc50d08be5e5764699cfb5525900d7e17491e4fa8","time":1492819914,"txlength":34,"poolInfo":{}}],"length":126,"pagination":{"next":"2017-04-23","prev":"2017-04-21","currentTs":1492905599,"current":"2017-04-22","isToday":false,"more":false}};

        expect(response.status).toEqual(200);
        expect(ignoring(response.body, ['poolInfo', 'size'])).toEqual(ignoring(expected, ['poolInfo', 'size']));
    });

    test('Get block summaries by date 2017-04-22 with limit 10', async () => {
        const response = await request(app.callback()).get('/blocks?blockDate=2017-04-22&limit=10');

        const expected = {"blocks":[{"height":1119579,"size":11586,"hash":"00000000000000498d91fe21a18329b44579fca5c996e81a996502eb9ba1d991","time":1492905061,"txlength":29,"poolInfo":{}},{"height":1119578,"size":21666,"hash":"0000000038f15a5bd9131ae8fe607df26a0ba969d724296c7b3b92dae4bf123b","time":1492904105,"txlength":52,"poolInfo":{}},{"height":1119577,"size":8624,"hash":"0000000000000892c852542c399491b1fd0a49795823f2020c8e43e7e5eb9df2","time":1492902900,"txlength":23,"poolInfo":{}},{"height":1119576,"size":5582,"hash":"000000000000093da8573c394023b1b5ac5c01c795f9160d80acb44cbcf994c5","time":1492902270,"txlength":16,"poolInfo":{}},{"height":1119575,"size":5551,"hash":"00000000000003cc44e8960c10ea16d816bb15005d155f00c022480f1b8fc732","time":1492902024,"txlength":13,"poolInfo":{}},{"height":1119574,"size":2172,"hash":"00000000000006793c1c7122d71a6357515ee45a3dbd623e2d04f573ec9dd6cb","time":1492901785,"txlength":7,"poolInfo":{}},{"height":1119573,"size":7843,"hash":"0000000000000be0e6f946277b6e93e1d0bbbad6107b994abc0f7463295c2934","time":1492901728,"txlength":19,"poolInfo":{}},{"height":1119572,"size":15825,"hash":"0000000000000464856fce7a93cffbc266a3998a7ae0089f1c2c0f8d0e60cd3c","time":1492901388,"txlength":43,"poolInfo":{}},{"height":1119571,"size":3856,"hash":"000000000000058d4fb9b5ee75017f69c866eff5635be0f6563d1a10aa147fc3","time":1492900567,"txlength":11,"poolInfo":{}},{"height":1119570,"size":4359,"hash":"0000000000000afcd9fc2c66080b61d7762f48146750588af11337a18d47d404","time":1492900436,"txlength":12,"poolInfo":{}}],"length":10,"pagination":{"next":"2017-04-23","prev":"2017-04-21","currentTs":1492905599,"current":"2017-04-22","isToday":false,"more":true,"moreTs":1492905600}};

        expect(response.status).toEqual(200);
        expect(ignoring(response.body, ['poolInfo', 'size'])).toEqual(ignoring(expected, ['poolInfo', 'size']));
    });

    test('Get block summaries by date 2017-04-22 with limit 3', async () => {
        const response = await request(app.callback()).get('/blocks?blockDate=2017-04-22&limit=3');

        const expected = {"blocks":[{"height":1119579,"size":11586,"hash":"00000000000000498d91fe21a18329b44579fca5c996e81a996502eb9ba1d991","time":1492905061,"txlength":29,"poolInfo":{}},{"height":1119578,"size":21666,"hash":"0000000038f15a5bd9131ae8fe607df26a0ba969d724296c7b3b92dae4bf123b","time":1492904105,"txlength":52,"poolInfo":{}},{"height":1119577,"size":8624,"hash":"0000000000000892c852542c399491b1fd0a49795823f2020c8e43e7e5eb9df2","time":1492902900,"txlength":23,"poolInfo":{}}],"length":3,"pagination":{"next":"2017-04-23","prev":"2017-04-21","currentTs":1492905599,"current":"2017-04-22","isToday":false,"more":true,"moreTs":1492905600}};

        expect(response.status).toEqual(200);
        expect(ignoring(response.body, ['poolInfo', 'size'])).toEqual(ignoring(expected, ['poolInfo', 'size']));

    });
});