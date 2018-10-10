'use strict';

const router = require('express').Router(),
  passport = require('passport'),
  signupValidator = require('./validators/validators').SignUpValidation();

router.get('/', (req, res) => {

  res.render('auth/signup', {title: 'Sign Up', csrf: req.csrfToken()});
});

router.post('/', signupValidator, passport.authenticate('local.signup',
{
  successRedirect: '/auth/login',
  failureRedirect: '/auth/signup',
  failureFlash: true
}))

module.exports = router;
