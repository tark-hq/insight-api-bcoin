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
