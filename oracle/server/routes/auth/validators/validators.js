'use strict';

module.exports = {
  SignUpValidation: function() {
    return (req, res, next) => {
      req
        .checkBody('firstname', 'Firstname is required')
        .notEmpty()
        .trim();
      req
        .checkBody('lastname', 'Lastname is required')
        .notEmpty()
        .trim();
      req.checkBody('email', 'Email is required').notEmpty();
      req.checkBody('email', 'Email is invalid').isEmail();
      req.checkBody('password', 'Password is required').notEmpty();
      // req
      //   .checkBody('password', 'Password must not be less than 8 characters')
      //   .isLength({ min: 8 });
      // req.checkBody('passwordConfirm', 'Password is required').notEmpty();
      // req
      //   .checkBody('passwordConfirm', 'Passwords  do not match')
      //   .equals(req.body.password);

      req
        .getValidationResult()
        .then(result => {
          const errors = result.array();
          const messages = [];

          errors.forEach(error => {
            messages.push(error.msg);
          });

          req.flash('error', messages);
          res.redirect('/auth/signup');
        })
        .catch(err => {
          return next();
        });
    };
  },

  LoginValidation: function() {
    return (req, res, next) => {
      req.checkBody('email', 'Email is required').notEmpty();
      req.checkBody('email', 'Email is invalid').isEmail();
      req.checkBody('password', 'Password is required').notEmpty();

      req
        .getValidationResult()
        .then(result => {
          const errors = result.array();
          const messages = [];

          errors.forEach(error => {
            messages.push(error.msg);
          });

          req.flash('error', messages);
          res.redirect('/auth/login');
        })
        .catch(err => {
          return next();
        });
    };
  },

  ForgotPasswordValidation: function() {
    return (req, res, next) => {
      req.checkBody('email', 'Email is required').notEmpty();
      req.checkBody('email', 'Email is invalid').isEmail();

      req
        .getValidationResult()
        .then(result => {
          const errors = result.array();
          const messages = [];

          errors.forEach(error => {
            messages.push(error.msg);
          });

          req.flash('error', messages);
          res.redirect('/auth/forgot');
        })
        .catch(err => {
          return next();
        });
    };
  },

  PasswordResetValidation: function() {
    return (req, res, next) => {
      req.checkBody('password', 'Password is required').notEmpty();
      req
        .checkBody('password', 'Password must not be less than 8 characters')
        .isLength({ min: 8 });
      req.checkBody('passwordConfirm', 'Password is required').notEmpty();
      req
        .checkBody('passwordConfirm', 'Passwords  do not match')
        .equals(req.body.password);

      req
        .getValidationResult()
        .then(result => {
          const errors = result.array();
          const messages = [];

          errors.forEach(error => {
            messages.push(error.msg);
          });

          req.flash('error', messages);
          res.redirect('/auth/signup');
        })
        .catch(err => {
          return next();
        });
    };
  }
};
