'use strict';

const router = require('express').Router(),
      Product = require('../../models/Product');

router.get('/:id', (req, res) => {

  Product.findById(req.params.id)
    .then((product) => {
      if (!product) {
        res.status(404).render('errors/404', { title: 'Product Not Found | Vendo' });
      } else {
        res.render('guiStockManager/modify_product', {
          title: 'Add Product | Vendo', product: product, csrf: req.csrfToken()
        });
      }
    }).catch((err) => {
      console.error('Product modification failed.');
      res.status(500).render('errors/500', {title: 'SERVER ERROR | Vendo'});
    });

});

router.post('/', (req, res) => {

});
module.exports = router;
