'use strict';

const router = require('express').Router();

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

module.exports = router;
