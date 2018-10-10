'use strict';

const router = require('express').Router();

// Setup routes
const vendorRouter = require('./vendor');

router.use('/', vendorRouter);

module.exports = router;
