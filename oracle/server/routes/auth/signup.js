'use strict';

const router = require('express').Router(),
      request = require('request'),
      User = require('../../models/User'),
      Account = require('../../models/Account'),
      web3 = require('../../smart_contracts/provider'),
      freeEth = require('../../smart_contracts/sendFreeEth');

router.get('/', (req, res) => {

  res.send({message: 'hello'});
});

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


      newUser.save(async (err) => {
        if (err) {
          console.error('ERROR SAVING NEW USER\n\n' + err);
          response.status(500).send({success: false, message: 'Error saving new user'});
        }
        let acc = await web3.eth.personal.newAccount(req.body.password);
        let account = new Account({address: acc, owner:newUser.id});
          account.save((err) => {
            if (err) {
              console.error('account failed to create');
              response.send({success: false, message: 'Failed to create account'})
            }
          });
        // Get free ether
        freeEth(acc);
      });

      // Create new useranonymous id
      let options = {
        uri: process.env.VENDOR_URL + '/api/buyer',
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
