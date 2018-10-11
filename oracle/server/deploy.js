const Web3 = require('web3'),
      TestRPC = require('ethereumjs-testrpc'),
      Interface = require('./compile').interface,
      Bytecode = require('./compile').bytecode,
      Contract = require('./models/Contract');

const web3 = new Web3(TestRPC.provider());

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log("Awaiting to deploy contracts using account ", accounts[0]);

  const sellContractAddress = await new web3.eth.Contract(JSON.parse(Interface))
    .deploy({ data: Bytecode })
    .send({ gas: '1000000', from: accounts[0] });

  let contract = new Contract({ name:"Sell", address: sellContractAddress.options.address });
  contract.save((err) => {
    if(err) {
      console.error("Failure saving contract : \n", err);
    }
  });

    console.log('\n\nSell contract deployed to : ', sellContractAddress.options.address);
}

deploy();
