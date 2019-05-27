'use strict';

const router = require('express').Router(),
      Product = require('../../models/Product'),
      perPage = 9;

router.get('/', (req, res) => {
  let page = req.query.page || 1;

  Product
    .find({})
    .select('productName price description totalStock')
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .exec( async (err, products) => {
      if (err) {
        console.error('ERROR FINDING ALL THE PRODUCTS');
        req.flash('error', 'An Error occurred while locating the products.');
        res.redirect('/stock/gui/all');
      } else {
        // Get the total number of Products that can be retrieved
        await Product
        .find({})
        .count()
        .exec((err, count) => {
          if (err) {
            console.error('ERROR COUNTING ITEMS IN all_products.js\n\n' + err);
            return res.status(500).render('errors/500', { title: 'ERROR | SERVER ERROR | Vendo' });
          } else {
            // console.log(products);
            res.render('guiStockManager/all_products', {title: 'ALL PRODUCTS | Vendo',
              hasProuducts: products.length > 0, products: products, pages: Math.ceil(count / perPage),
              current: page, searchQuery: ''});
          }
        });
      }
    });
});

module.exports = router;
