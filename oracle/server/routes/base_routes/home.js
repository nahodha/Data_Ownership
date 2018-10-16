'use strict';

const router = require('express').Router(),
      Account = require('../../models/Account'),
      Contract = require('../../models/Contract'),
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

router.post('/allowmine', async (req, res) => {
  if (req.query.apiKey == process.env.MINE_API_KEY) {
    let mineeAccount = await Account.findOne({ owner: req.body.userId }).exec();

    // Unlock accounts
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
    let mine = await Mine(req.body.contractAddress);

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
        value: web3.utils.toWei('0.1', 'ether'),
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


module.exports = router;
