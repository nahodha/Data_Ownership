'use strict';

const router = require('express').Router(),
      async = require('async'),
      bcrypt = require('bcrypt'),
      nodemailer = require('nodemailer'),
      User = require('../../models/User'),
      validator = require('./validators/validators').PasswordResetValidation();

router.get('/:token', (req, res) => {
  // check if token exists in db and not expired
  User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() }
  })
  .then((user) => {
    if (!user) {
      req.flash('error', 'Password request token is invalid or has expired!');
      return res.redirect('/auth/forgot');
    }
    res.render('auth/password_reset', {
      title: 'Reset Password'
    });
  })
  .catch((err) => {
    console.error('ERROR AT PASSWORD RESET findOne\n\n' + err);
    done(err);
  })

});

router.post('/:token', validator, (req, res) => {
  async.waterfall([
    function(done) {
      User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { $gt: Date.now() }
      })
      .then((user) => {
        if (!user) {
          req.flash('error', 'Password request token is invalid or has expired!');
          return res.redirect('/auth/forgot');
        }

        if (req.body.password === req.body.passwordConfirm) {
          user.password = user.encryptPassword(req.body.password);
          user.resetPasswordExpires = undefined;
          user.resetPasswordToken = undefined;
          user.save(function(err) {
            if(err){
              console.error('ERROR UPDATING PASSWORD IN RESET PASSWORD\n\n' + err);
            }
            done(err, user);

          });
        } else {
          req.flash('error', 'Passwords do not match!');
          return res.redirect('/auth/password_reset' + req.params.token);
        }

      })
      .catch((err) => {
        console.error('ERROR AT PASSWORD RESET findOne\n\n' + err);
        done(err);
      })
    },
    function (user, done) {
      let smtpTransport = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        secure: true, // use ssl
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS
        }
      });

      let mailOptions = {
        to: user.email,
        from: process.env.MAIL_USER,
        subject: 'Your Password Has Been Changed',
        text: 'Hello, ' + user.firstname + '\n' +
              'This is a confirmation that the account for ' + user.email + ' has been changed.\n' +
              'For any other queries please contact customer support at ' + process.env.MAIL_USER
      };

      smtpTransport
        .sendMail(mailOptions)
        .then(() => {
          req.flash('success', 'Success your password has been changed.');
          done(null, user);
        })
        .catch((err) => {
          console.error('ERROR IN sendMail\n\n' + err);
          done(err);
        });

    }
  ], function(err) {
    if (err){
      res
        .status(500)
        .render('errors/500', {title: 'ERROR | WEKAVENUE'});
    } else {
      res.redirect('/auth/login');
    }
  });
});

module.exports = router;
