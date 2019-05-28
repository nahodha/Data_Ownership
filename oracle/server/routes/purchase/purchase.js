'use strict';

const router = require('express').Router(),
      request = require('request'),
      Product = require('../../models/Product'),
      Vendor = require('../../models/Vendor'),
      Account = require('../../models/Account'),
      User = require('../../models/User'),
      Purchase = require('../../models/Purchase'),
      web3 = require('../../smart_contracts/provider'),
      SellContract = require('../../smart_contracts/createSell');

router.get('/', (req, res) => {
  res.send({message: 'hello'});
});

router.post('/:id', async (req, res, ) => {
  let user = await User.findById(req.body.userId).exec();
  let vendor = await Vendor.findOne({ vendorName: 'vendo' }).exec();
  let buyerAccount = await Account.findOne({ owner: req.body.userId }).exec();
  let sellerAccount = await Account.findOne({ owner: vendor.id }).exec();

  if (!user || !vendor || !buyerAccount || !sellerAccount) {
    return res.status(500).send({ success: false, message: 'Failure!' });
  }

  // Unlock accounts

  if (!user.validUserPassword(req.body.password)) {
    return res.send({success: false, message: 'wrong password'});
  }

  web3.eth.personal.unlockAccount(buyerAccount.address, req.body.password, process.env.UNLOCK_TIME);
  web3.eth.personal.unlockAccount(sellerAccount.address, process.env.VENDOR_PASSWORD, process.env.UNLOCK_TIME);

  // Create new sell contract with the buyer address
  // The buyer pays for creation of the contract
  const Sell = await SellContract(buyerAccount.address);

  let addedBuyer = await Sell.methods.addBuyer(sellerAccount.address)
    .send({
      from: buyerAccount.address,
      gas: '1000000'
    });

  if (addedBuyer) {
    let buy = await Sell.methods.buy()
      .send({
        value: web3.utils.toWei(req.body.price, 'ether'),
        from: buyerAccount.address,
        gas: '1000000'
      });
  }

  let purchase = new Purchase();

  purchase.buyer = req.body.userId;
  // purchase.product = req.params.id;
  purchase.amountBought = req.body.amount;
  purchase.totalPrice = req.body.price;

  purchase.save((err) => {
    if (err) {
      res.send({ success: false });
    }
  });

  let options = {
    uri: process.env.VENDOR_URL + '/api/purchase',
    method: 'POST',
    qs: {apiKey: process.env.API_KEY},
    json: {
      productName: req.body.productName,
      buyer: user.userAnonId,
      amount: req.body.amount,
      price: req.body.price
    }
  };

  request(options, (err, result, body) => {
    if (err) {
      res.send({success: false});
    } else {
      // let json = JSON.parse(body);
      if (!body.success) {
        res.send({success: false});
      }
      res.send({success: true});
    }
  });

});

module.exports = router;
