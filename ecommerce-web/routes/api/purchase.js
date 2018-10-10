'use strict';

const router = require('express').Router(),
      Purchase = require('../../models/Purchase'),
      Product = require('../../models/Product'),
      Buyer = require('../../models/User');

router.post('/', (req, res) => {
  product = Product.find({name: req.body.productName}).exec();
  buyer = Buyer.find({buyerId: req.body.buyer}).exec();

  let purchase = new Purchase();

  purchase.buyer = buyer.id;
  purchase.product = product.id;
  purchase.amountBought = req.body.amount;
  purchase.totalPrice = req.body.price;

  purchase.save((err) => {
    if (err) {
      res.status(500).send({success: false, message: 'Error creating new purchase!'});
      next(err);
    } else {
      res.status(200).send({success: true});
    }
  });
});

module.exports = router;
