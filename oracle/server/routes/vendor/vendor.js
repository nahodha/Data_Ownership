'use strict';

const router = require('express').Router(),
      request = require('request'),
      Account = require('../../models/Account'),
      Vendor = require('../../models/Vendor'),
      web3 = require('../../smart_contracts/provider'),
      freeEth = require('../../smart_contracts/sendFreeEth');

router.post('/products', (req, res) => {
  let options = {
    uri: process.env.VENDOR_URL + '/api/stock',
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
        res.send({success: true, products: json.products});
      }
    }
  })
});

router.post('/', (req, res) => {
  if (req.query.apiKey == process.env.API_KEY) {
  // Create vendor
    let vendor = new Vendor({
      vendorName: 'vendo'
    });
    vendor.save(async (err) => {
      if (err) {
        console.error('Error saving vendor' + err);
        res.status(500).send({
          success: false,
          message: 'failed to create new vendor'
        });
      } else {
        // Create vendors account
        let acc = await web3.eth.personal.newAccount(process.env.VENDOR_PASSWORD);
        let account = new Account({address: acc, owner:vendor.id});
        await account.save((err) => {
          if (err) {
            console.error('account failed to create');
            res.status(500).send({success: false, message: 'Failed to create account'})
          }
        });
        // Get free ether
        freeEth(acc);
      }
    });
    res.send({ success: true });
  } else {
    res.status(403).send({success: false, message: 'You\'re not supposed to be here'})
  }
})

module.exports = router;
