'use strict';

const bcrypt = require('bcrypt'),
  LocalStrategy = require('passport-local').Strategy,
  User = require('../models/User');

module.exports = function(passport){

  passport.serializeUser((user, done) => {

    done(null, user.id);

  });

  passport.deserializeUser((id, done) => {
    User.findById(id)
    .then((user) => {
      done(null, user);
    })
    .catch((err) => {
      console.error('ERROR AT deserializeUser localStrategy\n\n' + err);
      return done(err);
    });
  });

  passport.use('local.signup', new LocalStrategy({

      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true

    }, (req, email, password, done) => {

      User.findOne({ 'email': email })
        .then(currentUser => {

          if (currentUser) {

            return done(null, false, req.flash('error', 'User with email already exists!'));

          } else {


            const newUser = new User();
            newUser.firstname = req.body.firstname;
            newUser.lastname = req.body.lastname;
            newUser.email = req.body.email;
            newUser.password = newUser.encryptPassword(req.body.password);

            newUser.save((err) => {
              if (err) console.error('ERROR SAVING NEW USER\n\n' + err);

              req.flash('sucess', 'You have successfully registered please Log In to access your account.')
              req.session.loggedInUser = newUser.id;
              req.session.cookie.expires = new Date(Date.now() + (2 * 24 * 60 * 60 * 1000)); // 2 days
              done(err, newUser);
            });
          }

        })
        .catch((err) => {
          console.error('ERROR AT LOCAL SIGN UP\n\n' + err);
          return done(err);
        });
    })
  );

    passport.use('local.login', new LocalStrategy({

      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true

    }, (req, email, password, done) => {

        User.findOne({ 'email': email })
        .then( async (user) => {

          const messages = [];

          if (!user || !user.validUserPassword(password)) {

            messages.push('Email Does not exist or Password isInvalid');
            return done(null, false,req.flash('error', messages));

          }
          req.session.loggedInUser = user.id;

          if (req.body.keepMeLoggedIn){
            // if user checks keep me logged in they session is stored for 2 months
            req.session.cookie.expires = new Date(Date.now() + (60 * 24 * 60 * 60 * 1000));
          } else {
            // reset session to expire 2 days if user does check the keep me logged in
            req.session.cookie.expires = new Date(Date.now() + (2 * 24 * 60 * 60 * 1000));
          }

          return done(null, user);

        }).catch((err) => {

          console.error('ERROR IN User.FindOne() local.login\n\n' + err);
          return done(err);

        });
    })  // end LocalStrategy
  );
};
