'use strict';

const router = require('express').Router(),
  passport = require('passport');

router.get('/', (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
