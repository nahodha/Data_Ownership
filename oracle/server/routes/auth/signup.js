'use strict';

const router = require('express').Router(),
      request = require('request'),
      User = require('../../models/User'),
      signupValidator = require('./validators/validators').SignUpValidation();

router.get('/', (req, res) => {

  res.send({message: 'hello'});
});

// router.post('/', passport.authenticate('local.signup',
// {
//   successRedirect: '/auth/login',
//   failureRedirect: '/auth/signup',
//   failureFlash: true
// }))

router.post('/', (req, response) => {

  User.findOne({ 'email': req.body.email })
  .then(currentUser => {

    if (currentUser) {

      return response.send({success: false, message: 'User with email already exists!'});

    } else {

      const newUser = new User();
      newUser.firstname = req.body.firstname;
      newUser.lastname = req.body.lastname;
      newUser.email = req.body.email;
      newUser.password = newUser.encryptPassword(req.body.password);


      newUser.save((err) => {
        if (err) {
          console.error('ERROR SAVING NEW USER\n\n' + err);
          response.status(500).send({success: false, message: 'Error saving new user'});
        }

        // req.flash('sucess', 'You have successfully registered please Log In to access your account.')
        // req.session.loggedInUser = newUser.id;
        // req.session.cookie.expires = new Date(Date.now() + (2 * 24 * 60 * 60 * 1000)); // 2 days
      });

      // Create new useranonymous id
      let options = {
        uri: 'http://vendo.grievy.com/api/buyer',
        method: 'POST',
        qs: {apiKey: process.env.API_KEY},
      };


      request(options, async (err, res, body) => {
        if (err) {
          console.error('Error sending message: ' + err);
          response.send({success: false, message: 'Request to create new user failed'});
        } else {
          let json = JSON.parse(body);
          newUser.userAnonId = json.buyer;
          await User.update({_id: newUser.id}, {$set: {userAnonId: json.buyer}}, (err) => {
            if (err) {
              console.error(err);
              response.send({success: false, message: 'Error creating userAnonId'});
            } else {
              response.send({success: true, message: 'success'});
            }
          });
        }
      });



    }

  })
  .catch((err) => {
    console.error('ERROR AT LOCAL SIGN UP\n\n' + err);
    return response.send({success: false, message: 'Error signin up new user'});
  });
});

module.exports = router;
