const web3 = require('./provider'),
      Account = require('../models/Account'),
      Contract = require('../models/Contract'),
      Mine = require('./build/Mine.json'),
      Factory = require('./build/MineFactory.json');

module.exports = async (address) => {
  // Get mine Factory address
  const contract = await Contract.findOne({ name: { $regex: /^MineFactory$/ } }).exec();

  // Get factory address to be able to invoke factory methods
  const factory = await new web3.eth.Contract(JSON.parse(Factory.interface),
      contract.contractAddresses[contract.contractAddresses.length - 1]); // use the latest address

  // Create new mine contract using parsed address
  await factory.methods.createMineContract()
    .send({
      from: address,
      gas: '1000000'
    });

  // Get all the addresses for the mine contracts
  const addresses = await factory.methods.getDeployedMineContracts().call();

  // Use the latest address
  let mineAddress = addresses[addresses.length - 1];

  // Create new mine contract
  let mine = await new web3.eth.Contract(
    JSON.parse(Mine.interface),
    mineAddress
  );

  // get address details for parsed address
  let account = await Account.findOne({ address: address }).exec();

  // Save new mine contract in the db
  let newContract = new Contract();
  newContract.name = 'Mine';
  newContract.contractAddresses.push(mine.options.address);
  newContract.deployerAddress = account.id;

  await newContract.save((err) => {
    if (err) console.error('Failed to save new Contract' + err);
  });

  return mine;
};
