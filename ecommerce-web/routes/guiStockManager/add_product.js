'use strict';

const router = require('express').Router(),
      Product = require('../../models/Product');


router.get('/', (req, res) => {

  res.render('guiStockManager/add_product', { title: 'Add Product | Vendo', csrf: req.csrfToken() });

});

router.post('/', (req, res) => {
  console.log('\n\n request is in\n\n')
  Product
  .findOne({productName: req.body.productName})
    .then((product) => {
      if (!product) {
        const newProduct = Product({
          productName: req.body.productName,
          description: req.body.description,
          price: req.body.price,
          category: req.body.category,
          totalStock: req.body.totalStock
        });

        newProduct.save((err) => {
          if (err) {
            console.error('ERROR SAVING NEW PRODUCT!\n\n' + err);
            return res.status(500).render('errors/500', {title: '500 | SERVER ERROR | Vendo'});
          } else {
            console.log("\n\nSaving\n\n");
            res.redirect('/stock/gui/product/' + newProduct.id);
          }
        });
      } else {
      req.flash('error', 'This product already exists')
      console.log("\n\nElsewhere!!\n\n");
      return res.redirect('/stock/gui/product/' + product.id);
    }

    })
    .catch((err) => {
      console.error('ERROR SAVING NEW PRODUCT\n\n' + err);
      res.status(500).render('errors/500', {title: '500 | SERVER ERROR | Vendo'});
    });
});

module.exports = router;
