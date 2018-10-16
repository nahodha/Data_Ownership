'use strict';

const router = require('express').Router(),
      request = require('request'),
      User = require('../../models/User'),
      Account = require('../../models/Account');

router.get('/products', (req, res, next) => {
  let options = {
    uri: process.env.VENDOR_URL + '/api/stock',
    method: 'GET',
    qs: {apiKey: process.env.API_KEY}
  };

  request(options, (err, response, body) =>{
    if (err) {
      res.send({success: false});
      next(err);
    } else {
      let json = JSON.parse(body);
      if (!json.success) {
        response.send({success: false});
        next(err);
      } else {
        res.send({success: true, products: json.products});
      }
    }
  })
});

router.post('/accounts', (req, res) => {
  if (req.params.apiKey == process.env.API_KEY) {
    let user = User.find({email: req.body.email}).exec();
    let account = Account.find({_id: user.id}).exec();

    res.send({success: true, account: account});
  } else {
    res.status(403).send({success: false, message: 'You\'re not supposed to be here'})
  }
});
router.post('/mine', (req, res) => {
  User.find({'email': req.body.email })
    .then((user) => {
      if (!user) {
        res.send({success: false});
      } else {
        if (req.body.response == "true"|| req.body.response == true) {
          user.mine = true
        } else {
          user.mine = false;
        }
        user.save();
        res.send({success: true});
      }
    })
    .catch((err) =>{
      console.error(err);
      res.send({success: false});
    })
})

module.exports = router;
