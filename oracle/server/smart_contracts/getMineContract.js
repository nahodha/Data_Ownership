const web3 = require('./provider'),
      Account = require('../models/Account'),
      Contract = require('../models/Contract'),
      Mine = require('./build/Mine.json');

module.exports = async (address) => {
  // Get contract with that address
  let contract = await Contract.findOne({contractAddresses: address}).exec();

  if (contract) {
    let mine = await new web3.eth.Contract(
      JSON.parse(Mine.interface),
      address
    );

    return mine;

  } else {
    return false;
  }
};
