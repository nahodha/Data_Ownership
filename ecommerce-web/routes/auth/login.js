'use strict';

const router = require('express').Router(),
  passport = require('passport'),
  loginValidator = require('./validators/validators').LoginValidation();

router.get('/', (req, res) => {

  res.render('auth/login', {
    title: 'Log In',
    csrf: req.csrfToken()
  });
});

router.post('/', loginValidator, passport.authenticate('local.login',
{
  successRedirect: '/stock/gui/all',
  failureRedirect: '/auth/login',
  failureFlash: true
}));

module.exports = router;
