const web3 = require('./provider'),
      Account = require('../models/Account');

module.exports = async (address) => {
  // Get list of accounts with node type
  let accounts = await Account.find({accountType: 'node'}).exec();

  for (let i = 0; i < accounts.length; i++) {
    await web3.eth.sendTransaction({
      from: accounts[i].address,
      to: address,
      value: web3.utils.toWei('1', 'ether'),
      gas: '1000000'
    });
  }
};
