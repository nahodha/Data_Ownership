'use strict';

const router = require('express').Router(),
      async = require('async'),
      nodemailer = require('nodemailer'),
      crypto = require('crypto'),
      User = require('../../models/User'),
      validator = require('./validators/validators').ForgotPasswordValidation();

router.get('/', (req, res) => {

  res.render('auth/forgot_password', {
    title: 'Forgot Password'
  });
});


router.post('/', validator, (req, res, next) => {

  async.waterfall([

    function (done) {
      crypto.randomBytes(20, function (err, buf) {
        let token = buf.toString('hex');
        console.log('TOKEN: ' + token + '\n\n');
        done(err, token);
      });
    },
    function (token, done) {
      User.findOne({
        'email': req.body.email
      })
        .then((user) => {
          console.log('USER\n\n' + user);
          if (!user) {
            req.flash('error', 'No account with that email exists');
            return res.redirect('/auth/forgot');
          }

          user.resetPasswordToken = token,
            user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

          user.save();
          console.log('\n\n' + user);
          done(null, token, user);
        })
        .catch((err) => {
          console.error('ERROR IN User.findOne async waterfall method\n\n' + err);
          done(err);
        });
    },
    function (token, user, done) {
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
        subject: 'Vendo Password Reset',
        text: 'You are receiving this email because you (or someone else) have requested the reset of the password of your accout.' +
              'Please click the following link, or paste this on your browser to complete the process. THIS PASSWORD EXPIRES IN ONE HOUR.' +
              'If you did not request this, please ignore this email and your password will remain unchanged.\n' +
              'https://' + req.headers.host + '/auth/password_reset/' + token + '\n\n' +
              'For any other queries please contact customer support' + process.env.MAIL_USER
      };

      smtpTransport
        .sendMail(mailOptions)
        .then(() => {
          req.flash("success", "An email has been sent to " + user.email + " with further instructions.");
          done(null, 'done');
        })
        .catch(err => {
          console.error("ERROR IN sendMail\n\n" + err);
          done(err);
        });
    }

  ], function(err) {
    if (err) return next(err);

    res.redirect('/auth/forgot');
  });

});

module.exports = router;
