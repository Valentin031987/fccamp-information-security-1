const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

const url = "/api/stock-prices/";
suite('Functional Tests', function () {

    test("Viewing one stock: GET request to /api/stock-prices/", function (done) {
        const input = { stock: 'GOOG' }
        chai.request(server)
            .get(url)
            .query(input)
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.isObject(res.body);
                assert.property(res.body.stockData, 'stock');
                assert.property(res.body.stockData, 'price');
                assert.property(res.body.stockData, 'likes');
                assert.notProperty(res.body.stockData, 'likeMsj')
                assert.isNumber(res.body.stockData.price)
                assert.isNumber(res.body.stockData.likes)
                done();
            });
    });

    test("Viewing one stock and liking it: GET request to /api/stock-prices", function (done) {
        const input = { stock: 'GOOG', like: true }
        chai.request(server)
            .get(url)
            .query(input)
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.isObject(res.body);
                assert.property(res.body.stockData, 'stock');
                assert.property(res.body.stockData, 'price');
                assert.property(res.body.stockData, 'likes');
                assert.property(res.body.stockData, 'likeMsj')
                assert.equal(res.body.stockData.likeMsj, 'New record added')
                assert.isNumber(res.body.stockData.price)
                assert.isNumber(res.body.stockData.likes)
                done();
            });
    });

    test("Viewing the same stock and liking it again: GET request to /api/stock-prices/", function (done) {
        const input = { stock: 'GOOG', like: true }
        chai.request(server)
            .get(url)
            .query(input)
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.isObject(res.body);
                assert.property(res.body.stockData, 'stock');
                assert.property(res.body.stockData, 'price');
                assert.property(res.body.stockData, 'likes');
                assert.property(res.body.stockData, 'likeMsj')
                assert.equal(res.body.stockData.likeMsj, 'Just one like per IP')                                
                assert.isNumber(res.body.stockData.price)
                assert.isNumber(res.body.stockData.likes)
                done();
            });
    });

    test("Viewing two stocks: GET request to /api/stock-prices/", function (done) {
        const input = { stock: ['GOOG', 'MSFT'] }
        chai.request(server)
            .get(url)
            .query(input)
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.isObject(res.body);
                assert.isArray(res.body.stockData);

                assert.property(res.body.stockData[0], 'stock');
                assert.property(res.body.stockData[0], 'price');
                assert.property(res.body.stockData[0], 'rel_likes');
                assert.isNumber(res.body.stockData[0].price)
                assert.isNumber(res.body.stockData[0].rel_likes)
                assert.notProperty(res.body.stockData[0], 'likeMsj')

                assert.property(res.body.stockData[1], 'stock');
                assert.property(res.body.stockData[1], 'price');
                assert.property(res.body.stockData[1], 'rel_likes');
                assert.isNumber(res.body.stockData[1].price)
                assert.isNumber(res.body.stockData[1].rel_likes)
                assert.notProperty(res.body.stockData[1], 'likeMsj')
                done();
            });
    });

    test("Viewing two stocks and liking them: GET request to /api/stock-prices/", function (done) {
        const input = { stock: ['GOOG', 'MSFT'], like: true }
        chai.request(server)
            .get(url)
            .query(input)
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.isObject(res.body);
                assert.isArray(res.body.stockData);

                assert.property(res.body.stockData[0], 'stock');
                assert.property(res.body.stockData[0], 'price');
                assert.property(res.body.stockData[0], 'rel_likes');
                assert.isNumber(res.body.stockData[0].price)
                assert.isNumber(res.body.stockData[0].rel_likes)
                assert.property(res.body.stockData[0], 'likeMsj')

                assert.property(res.body.stockData[1], 'stock');
                assert.property(res.body.stockData[1], 'price');
                assert.property(res.body.stockData[1], 'rel_likes');
                assert.isNumber(res.body.stockData[1].price)
                assert.isNumber(res.body.stockData[1].rel_likes)
                assert.property(res.body.stockData[0], 'likeMsj')
                done();
            });
    });

});
