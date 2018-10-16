'use strict';

const router = require('express').Router();

// Setup routes
const purchaseRouter = require('./purchase');

router.use('/', purchaseRouter);

module.exports = router;
