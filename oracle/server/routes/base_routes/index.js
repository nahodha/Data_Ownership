'use strict';

const router = require('express').Router();

// Setup routes
const buyerRouter = require('./home');

router.use('/', buyerRouter);


module.exports = router;
