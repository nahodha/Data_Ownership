'use strict';

const router = require('express').Router(),
      web3 = require('../../smart_contracts/provider'),
      Account = require('../../models/Account'),
      User = require('../../models/User'),
      Mine = require('../../smart_contracts/getMineContract'),
      MineContract = require('../../smart_contracts/createMine');  // Temporarily here

router.get('/', (req, res) => {
  res.render('base_routes/home', {title: 'DATA.ONE'});
});

router.all('/deploy', (req, res) => {
  if (req.query.apiKey == process.env.DEPLOY_API_KEY) {
    let deploy = require('../../smart_contracts/deploy');
    deploy();
    res.send('Deploy successful');
  } else {
    res.status(403).send('You\'re not supposed to be here');
  }

});

router.post('/allowMine', async (req, res) => {
  if (req.query.apiKey == process.env.MINE_API_KEY) {
    let mineeAccount = await Account.findOne({ owner: req.body.userId }).exec();
    let user = await User.findById(req.body.userId).exec();

    if (!user) {
      return res.send({ success: false, message: 'Your user doesn\'t exist' });
    }

    // Unlock accounts but make sure password is correct
    if (!user.validUserPassword(req.body.password)) {
      return res.send({ success: false, message: 'wrong password' });
    }

    web3.eth.personal.unlockAccount(mineeAccount.address, req.body.password, process.env.UNLOCK_TIME);

    // Get contract assume that address will always be passed as argument for now
    let mine = await Mine(req.body.contractAddress);

    // Add dataowner to the mining pool
    let allowMine = await  mine.methods.allowMine()
      .send({
        from: mineeAccount.address,
        gas: '1000000'
      });

    if (allowMine) {
      res.send({ success: true, message: 'Successfully added to mining pool' });
    } else {
      res.send({ success: false, message: 'Failed to add to mining pool' });
    }
  } else {
    res.status(403).send('You\'re not supposed to be here');
  }
});

router.post('/addMiner', async (req, res) => {
  if (req.query.apiKey == process.env.MINE_API_KEY) {
    let minerAccount = await Account.findOne({ owner: req.body.minerId }).exec();

    // Unlock accounts
    web3.eth.personal.unlockAccount(minerAccount.address, process.env.VENDOR_PASSWORD, process.env.UNLOCK_TIME);

    // Get contract assume that address will always be passed as argument for now
    let mine = await MineContract(minerAccount.address);

    // Add dataowner to the mining pool
    let addMiner = await  mine.methods.addMiner(minerAccount.address)
      .send({
        from: minerAccount.address,
        gas: '1000000'
      });

    if (addMiner) {
      res.send({ success: true, message: 'Successfully added miner' });
    } else {
      res.send({ success: false, message: 'Failed to add miner' });
    }
  } else {
    res.status(403).send('You\'re not supposed to be here');
  }
});

router.post('/mine', async (req, res) => {
  if (req.query.apiKey == process.env.MINE_API_KEY) {
    let minerAccount = await Account.findOne({ owner: req.body.minerId }).exec();

    // Unlock accounts
    web3.eth.personal.unlockAccount(minerAccount.address, process.env.VENDOR_PASSWORD, process.env.UNLOCK_TIME);

    // Get contract assume that address will always be passed as argument for now
    let mine = await Mine(req.body.contractAddress);

    let mined = await mine.methods.startMine()
      .send({
        value: web3.utils.toWei('0.6', 'ether'),
        from: minerAccount.address,
        gas: '1000000'
      });

    if (mined) {
      res.send({ success: true, message: 'Successfully mined' });
    } else {
      res.send({ success: false, message: 'Failed to mine' });
    }

    res.send({ success: true, message: 'Successful mine' });
  } else {
    res.status(403).send('You\'re not supposed to be here');
  }
});

router.post('/payOwners', async (req, res) => {
  if (req.query.apiKey == process.env.MINE_API_KEY) {
    let mineeAccount = await Account.findOne({ owner: req.body.userId }).exec();

    // Unlock accounts
    web3.eth.personal.unlockAccount(mineeAccount.address, req.body.password, process.env.UNLOCK_TIME);

    // Get contract assume that address will always be passed as argument for now
    let mine = await Mine(req.body.contractAddress);

    // Add dataowner to the mining pool
    let payOwners = await  mine.methods.payDataOwners()
      .send({
        from: mineeAccount.address,
        gas: '1000000'
      });

    if (payOwners) {
      res.send({ success: true, message: 'Successfully paid' });
    } else {
      res.send({ success: false, message: 'Failed to pay owners' });
    }
  } else {
    res.status(403).send('You\'re not supposed to be here');
  }
});


// GUI ROUTES

router.get('/addMinerGui', (req, res) => {
  const errors = req.flash('error');
  const success = req.flash('success');
  const messages = [];

  messages.push(errors);
  messages.push(success);

  res.render('base_routes/addMiner', {
    apiKey: process.env.MINE_API_KEY,
    hasErrors: errors.length > 0,
    hasSuccess: success.length > 0,
    messages: messages
  });
});

router.post('/addMinerGui', async (req, res) => {
  if (req.query.apiKey == process.env.MINE_API_KEY) {
    let minerAccount = await Account.findOne({ address: req.body.address }).exec();

    // Unlock accounts
    if (req.body.password != process.env.VENDOR_PASSWORD) {
      return res.redirect('/addMinerGui');
    }
    web3.eth.personal.unlockAccount(minerAccount.address, process.env.VENDOR_PASSWORD, process.env.UNLOCK_TIME);

    // Get contract assume that address will always be passed as argument for now
    let mine = await MineContract(minerAccount.address);

    // Add dataowner to the mining pool
    let addMiner = await  mine.methods.addMiner(minerAccount.address)
      .send({
        from: minerAccount.address,
        gas: '1000000'
      });

    if (addMiner) {
      req.flash('success', 'Successfully added Miner');
      return res.redirect('/addMinerGui');
    } else {
      req.flash('error', 'Failed to add miner!');
      return res.redirect('/addMinerGui');
    }
  } else {
    res.status(403).send('You\'re not supposed to be here');
  }
});


router.get('/mineGui', (req, res) => {
  const errors = req.flash('error');
  const success = req.flash('success');
  const messages = [];

  messages.push(errors);
  messages.push(success);

  res.render('base_routes/startMine', {
    apiKey: process.env.MINE_API_KEY,
    hasErrors: errors.length > 0,
    hasSuccess: success.length > 0,
    messages: messages
  });
});

router.post('/mineGui', async (req, res) => {
  if (req.query.apiKey == process.env.MINE_API_KEY) {
    const Vendor = require('../../models/Vendor');
    let vendor = await Vendor.findOne({ vendorName: 'vendo' }).exec();
    if (!vendor || req.body.password != process.env.VENDOR_PASSWORD) {
      return res.redirect('/mineGui');
    }
    let minerAccount = await Account.findOne({ owner: vendor.id }).exec();

    console.log(minerAccount);
    // Unlock accounts
    web3.eth.personal.unlockAccount(minerAccount.address, process.env.VENDOR_PASSWORD, process.env.UNLOCK_TIME);

    // Get contract assume that address will always be passed as argument for now
    let mine = await Mine(req.body.contractAddress);

    let mined = await mine.methods.startMine()
      .send({
        value: web3.utils.toWei('0.6', 'ether'),
        from: minerAccount.address,
        gas: '1000000'
      });

    if (mined) {
      req.flash('success', 'Successfully Mined contract');
      return res.redirect('/mineGui');
    } else {
      req.flash('error', 'Failed to Mined contract');
      return res.redirect('/mineGui');
    }

    res.send({ success: true, message: 'Successful mine' });
  } else {
    res.status(403).send('You\'re not supposed to be here');
  }
});


router.get('/payOwnersGui', (req, res) => {
  const errors = req.flash('error');
  const success = req.flash('success');
  const messages = [];

  messages.push(errors);
  messages.push(success);

  res.render('base_routes/payOwners', {
    apiKey: process.env.MINE_API_KEY,
    hasErrors: errors.length > 0,
    hasSuccess: success.length > 0,
    messages: messages
  });
});


router.post('/payOwnersGui', async (req, res) => {
  if (req.query.apiKey == process.env.MINE_API_KEY) {
    let user = await User.findOne({email: req.body.email}).exec();

    if (!user || !user.validUserPassword(req.body.password)) {
      return res.redirect('/payOwnersGui');
    }
    let mineeAccount = await Account.findOne({ owner: user.id }).exec();

    // Unlock accounts
    web3.eth.personal.unlockAccount(mineeAccount.address, req.body.password, process.env.UNLOCK_TIME);

    // Get contract assume that address will always be passed as argument for now
    let mine = await Mine(req.body.contractAddress);

    // Add dataowner to the mining pool
    let payOwners = await  mine.methods.payDataOwners()
      .send({
        from: mineeAccount.address,
        gas: '1000000'
      });

    if (payOwners) {
      req.flash('success', 'Successfully Paid owners!');
      return res.redirect('/payOwnersGui');
    } else {
      req.flash('error', 'Failed to Pay Owners');
      return res.redirect('/payOwnersGui');
    }
  } else {
    res.status(403).send('You\'re not supposed to be here');
  }
});


module.exports = router;
