const web3 = require('./provider'),
      Account = require('../models/Account'),
      Contract = require('../models/Contract'),
      Sell = require('./build/Sell.json'),
      Factory = require('./build/SellFactory.json');

module.exports = async (address) => {
  // Get sell Factory address
  const contract = await Contract.findOne({ 'name': { $regex: /^SellFactory$/i } }).exec();

  // get factory by the address so that the methods can be used to create a sell contract
  const factory = await new web3.eth.Contract(JSON.parse(Factory.interface),
      contract.contractAddresses[contract.contractAddresses.length - 1]); // use the latest address

  // Crete sell contract using the parsed address
  await factory.methods.createSellContract()
    .send({
      from: address,
      gas: '1000000'
    });

  // Get the list of addresses of deployed sell contracts
  const addresses = await factory.methods.getDeployedSellContracts().call();

  // Get the latest sell address
  let sellAddress = addresses[addresses.length - 1];

  // Get sell contract
  let sell = await new web3.eth.Contract(
    JSON.parse(Sell.interface),
    sellAddress
  );


  // get address details for parsed address
  let account = await Account.findOne({ address: address }).exec();

  // Save new sell contract in the db
  let newContract = new Contract();
  newContract.name = 'Sell';
  newContract.contractAddresses.push(sell.options.address);
  newContract.deployerAddress = account.id;

  await newContract.save((err) => {
    if (err) console.error('Failed to save new Contract' + err);
  });

  return sell;
};
