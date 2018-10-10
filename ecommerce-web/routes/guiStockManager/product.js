'use strict';

const router = require('express').Router(),
      Product = require('../../models/Product');

router.get('/:id', (req, res) => {

  Product.findById(req.params.id)
    .then((product) => {
      if (!product) {
        res.status(404).render('errors/404', { title: 'Page Not Found | Vendo' });
      } else {
        res.render('guiStockManager/product', { title: product.productName, product: product});
      }
    })
    .catch((err) => {
      console.error('ERROR VIEWING PRODUCT\n\n' + err);
      res.status(500).render('errors/500', { title: '500 | SERVER ERROR | Vendo' });
    });
});

module.exports = router;
