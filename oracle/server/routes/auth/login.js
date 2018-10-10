'use strict';

const router = require('express').Router(),
  User = require('../../models/User');

router.get('/', (req, res) => {

  res.send({success: true, message: 'hello'});
});

router.post('/', (req, response) => {
  User.findOne({ 'email': req.body.email })
    .then( async (user) => {

      const messages = [];

      if (!user || !user.validUserPassword(req.body.password)) {

        messages.push('Email Does not exist or Password isInvalid');
        return response.send({success: false, message: messages});

      }
      return response.send({success: true, user: user});



    })
    .catch((err) => {

      console.error('ERROR IN User.FindOne() local.login\n\n' + err);
      return Response.send({success: false, message: 'error logging in'});

    });
});

module.exports = router;
