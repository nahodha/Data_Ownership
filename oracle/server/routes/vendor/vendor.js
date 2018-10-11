'use strict';

const router = require('express').Router(),
      request = require('request'),
      Account = require('../../models/Account');

router.post('/products', (req, res) => {
  let options = {
    uri: 'http://vendo.grievy.com/api/stock',
    method: 'GET',
    qs: {apiKey: process.env.API_KEY}
  };

  request(options, (err, response, body) =>{
    if (err) {
      res.send({success: false});
      // next(err);
    } else {
      let json = JSON.parse(body);
      if (!json.success) {
        response.send({success: false});
        // next(err);
      } else {
        res.send({success: true, products: [json.products]});
      }
    }
  })
});

router.post('/', (req, res) => {
  if (req.params.apiKey == process.env.API_KEY) {
  // Create vendor
    let vendor = new vendor({
      vendorName: 'vendo'
    });
  } else {
    res.status(403).send({success: false, message: 'You\'re not supposed to be here'})
  }
})

module.exports = router;
