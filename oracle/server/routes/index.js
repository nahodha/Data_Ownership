'use strict';

const router = require('express').Router();

// Setup routes
const authRouters = require('./auth/index'),
      baseRouters = require('./base_routes/index'),
      purchaseRouters = require('./purchase/index'),
      userRouters = require('/user/user'),
      vendorRouters = require('./vendor/index');


router.use('/', baseRouters);
router.use('/user', userRouters);
router.use('/auth', authRouters);
router.use('/purchase', purchaseRouters);
router.use('/vendor', vendorRouters);

// Error handling middleware here
// Must be added after all other the router.use()
router.use('*', (req, res, next) => {
  res.status(404);

  // respond with html page
  if (req.accepts('html')) {
    res.render('errors/404', { title: '404 - Page not found!' });
    return;
  }

  // respond with json
  if (req.accepts('json')) {
    res.send({ error: '404 - Not found' });
    return;
  }

  // default to plain-text. send()
  res.type('txt').send('404 - Not found');
});


module.exports = router;
