'use strict';

const router = require('express').Router();

// Setup routes
const loginRouter = require('./login'),
  logoutRouter = require('./logout'),
  signupRouter = require('./signup'),
  forgotPasswordRouter = require('./forgot_password'),
  passwordResetRouter = require('./password_reset'),
  userAuthenticationMiddleware = require('../AuthenticationMiddleware').userAuthenticationMiddleware();


router.use('/login', loginRouter);
router.use('/logout', userAuthenticationMiddleware, logoutRouter);
router.use('/signup', signupRouter)
router.use('/forgot', forgotPasswordRouter);
router.use('/password_reset', passwordResetRouter);


module.exports = router;
