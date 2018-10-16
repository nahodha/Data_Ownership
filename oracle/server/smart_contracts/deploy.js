const web3 = require('./provider'),
      Account = require('../models/Account'),
      Contract = require('../models/Contract'),
      mineFactoryInterface = require('./build/MineFactory.json').interface,
      mineFactoryBytecode = require('./build/MineFactory.json').bytecode,
      sellFactoryInterface = require('./build/SellFactory.json').interface,
      sellFactoryBytecode = require('./build/SellFactory.json').bytecode;


// const deploy =
module.exports = async () => {
  console.log('here');
  // Get deployer account
  let deployerAccount = await Account.findOne({deployer: true}).exec();
  let deployAccount;
  let accounts;

  if (!deployerAccount) {
    accounts = await web3.eth.getAccounts();
    deployAccount = accounts[0];
  } else {
    deployAccount = deployerAccount.address;
  }


  const mineFactoryAddress = await new web3.eth.Contract(JSON.parse(mineFactoryInterface))
    .deploy({ data: '0x' + mineFactoryBytecode })
    .send({ gas: '4000000', from: deployAccount });

  const sellFactoryAddress = await new web3.eth.Contract(JSON.parse(sellFactoryInterface))
    .deploy({ data: '0x' + sellFactoryBytecode })
    .send({ gas: '4000000', from: deployAccount });

  let foundSellContract = await Contract.findOne({name: 'SellFactory'}).exec();
  let foundMineContract = await Contract.findOne({name: 'MineFactory'}).exec();

  if (!deployerAccount) {
    for (let i = 0; i < accounts.length; i++) {
      let acc = new Account({
        accountType: 'node',
        address: accounts[i]
      });

      // repetitive but needed for the account id
      if (i == 0) {
        // Set this account as the deployer
        acc.deployer = true;
      }

      await acc.save((err) => {
        if (err) {
          console.error('\nError saving new account \n\n' + err);
        }
      });

      if (i == 0) {

        if (foundSellContract) {
          Contract.update(
            { '_id': foundSellContract.id },
            { '$push': { 'contractAddresses': sellFactoryAddress.options.address } },
            (err, raw) => {
              if(err) {
                console.error(err);
              }
            }
          );
        } else {
          let contract = new Contract({
            name:'SellFactory',
            deployerAddress: acc.id
          });
          contract.contractAddresses.push(sellFactoryAddress.options.address);

          contract.save((err) => {
            if(err) {
              console.error("Failure saving contract : \n" + err);
            }
          });
        }

        if (foundMineContract) {
          Contract.update(
            { '_id': foundMineContract.id },
            { '$push': { 'contractAddresses': mineFactoryAddress.options.address } },
            (err, raw) => {
              if(err) {
                console.error(err);
              }
            }
          );
        } else {

          let contract = new Contract({
            name:'MineFactory',
            deployerAddress: acc.id
          });

          contract.contractAddresses.push(mineFactoryAddress.options.address);

          contract.save((err) => {
            if(err) {
              console.error("Failure saving contract : \n" + err);
            }
          });
        }
      }

    }
  } else {

    Contract.findByIdAndUpdate(foundMineContract.id,
      {'$push': { 'contractAddresses': mineFactoryAddress },
        deployerAddress: deployerAccount.id
      },
      { safe: true, upsert: true },
      function(err, doc) {
        if(err){
          console.error(err);
        }
    }
    );

    Contract.findByIdAndUpdate(foundSellContract.id,
      {'$push': { 'contractAddresses': sellFactoryAddress },
        deployerAddress: deployerAccount.id
      },
      { safe: true, upsert: true },
      function(err, doc) {
        if(err){
          console.error(err);
        }
    }
    );
    }
  };
