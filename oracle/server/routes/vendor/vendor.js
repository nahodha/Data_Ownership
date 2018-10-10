'use strict';

const router = require('express').Router(),
      request = require('request');

router.get('/products', (req, res, next) => {
  let options = {
    uri: 'http://vendo.grievy.com/api/stock',
    method: 'GET',
    qs: {apiKey: process.env.API_KEY}
  };

  request(options, (err, response, body) =>{
    if (err) {
      res.send({success: false});
      next(err);
    } else {
      let json = JSON.parse(body);
      if (!json.success) {
        response.send({success: false});
        next(err);
      } else {
        res.send({success: true, products: json.products});
      }
    }
  })
});

module.exports = router;
