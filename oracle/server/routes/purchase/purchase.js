'use strict';

const router = require('express').Router(),
      request = require('request'),
      Product = require('../../models/Product'),
      Account = require('../../models/Account'),
      User = require('../../models/User'),
      Purchase = require('../../models/Purchase'),
      Sell = require('../../sell');

router.get('/', (req, res) => {
});

router.post('/:id', (req, res, next) => {
  let user = User.findById(req.body.userId,).exec();
  let vendor = Vendor.findOne({vendorName: 'vendo'}).exec();
  let acc = Account.find({owner: user.id}).exec();
  let acc2 = Account.find({owner: vendor.id}).exec();

  let result = Sell(acc2.account, acc.account);

  console.log(result);

  let purchase = new Purchase();
  purchase.buyer = req.body.userId;
  purchase.product = req.params.id;
  purchase.amountBought = req.body.amount;
  purchase.totalPrice = req.body.price;

  purchase.save((err) => {
    if (err) {
      res.send({success: false});
      next(err);
    }
  });



  let options = {
    uri: 'http://vendo.grievy.com/api/purchase',
    method: 'POST',
    qs: {apiKey: process.env.API_KEY},
    json: {
      productName: req.body.productName,
      buyer: user.userAnonId,
      amount: req.body.amount,
      price: req.body.price
    }
  };

  request(options, (err, res, body) => {
    if (err) {
      res.send({success: false});
      next(err);
    } else {
      res.send({succeess: true});

      let json = JSON.parse(body);
      if (!json.success) {
        res.send({success: false});
        next(err);
      }
      res.send({success: true});
      next();
    }
  });

})

module.exports = router;
