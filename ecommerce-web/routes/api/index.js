'use strict';

const router = require('express').Router();

// Setup routes
const buyerRouter = require('./buyer'),
      purchaseRouter = require('./purchase'),
      stockRouter = require('./stock');

router.use('/buyer', buyerRouter);
router.use('/purchase', purchaseRouter);
router.use('/stock', stockRouter);


module.exports = router;
