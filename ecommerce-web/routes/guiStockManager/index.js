'use strict';

const router = require('express').Router(),
      request = require('request');

// Setup routes
const addProductRouter = require('./add_product'),
      removeProductRouter = require('./remove_product'),
      modifyProductRouter = require('./modify_product'),
      allProductsRouter = require('./all_products'),
      productRouter = require('./product');

router.use('/add', addProductRouter);
router.use('/remove', removeProductRouter);
router.use('/modify', modifyProductRouter);
router.use('/all', allProductsRouter);
router.use('/product', productRouter);

router.all('/account', (req, res) => {
  let options = {
    uri: process.env.ORACLE_URL + '/vendordetails',
    method: 'POST',
    qs: {apiKey: process.env.MINE_API_KEY}
  };

  request(options, (err, response, body) =>{
    if (err) {
      res.send({success: false});
    } else {
      let json = JSON.parse(body);
      if (!json.success) {
        res.render('account', {hasDetails: false, balance: 0, address: 'none', contract: 'none'});
      } else {
        res.render('account', {hasDetails: true, balance: json.balance, address: json.vendorAddress, contract: json.contract});
      }
    }
  });

});

module.exports = router;
