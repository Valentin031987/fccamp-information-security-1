'use strict';
const service = require('../service')

module.exports = function (app) {
  app.route('/api/stock-prices')

    .get(async function (req, res) {

      const like = req.query.like;
      const symbol = req.query.stock;
      const ip = req.ip;

      if (!Array.isArray(symbol)) {
        let response = await service.handleRequest(symbol, ip, like);
        res.json(response);
      } else {

        let s1 = await service.handleRequest(symbol[0], ip, like);
        let s2 = await service.handleRequest(symbol[1], ip, like);
        let response = service.parseResponse(s1.stockData, s2.stockData);
        return res.json(response);
      }

    });

};