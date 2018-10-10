'use strict';

const router = require('express').Router(),
      Product = require('../../models/Product'),
      perPage = 9;

router.get('/', (req, res, next) => {
  let page = req.query.page || 1;

  Product
    .find({})
    .select('productName price description totalStock')
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .exec( async (err, products) => {
      if (err) {
        res.send({success: false});
        next(err);
      } else {
        // Get the total number of Products that can be retrieved
        await Product
        .find({})
        .count()
        .exec((err, count) => {
        if (err) {
          console.error('ERROR COUNTING ITEMS IN all_products.js\n\n' + err);
          return res.status(500).send({ success:false});
        } else {
          // console.log(products);
          res.send({ success: true, hasProuducts: products.length > 0, products: JSON.stringify(products),
            pages: Math.ceil(count / perPage), current: page, searchQuery: ''});
        }
      });
      }
    });
});

module.exports = router;
