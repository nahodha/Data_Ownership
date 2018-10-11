const Web3 = require('web3'),
      TestRPC = require('ethereumjs-testrpc'),
      Contract = require('./models/Contract'),
      abi = require('./compile').byteCode;

module.exports = (sender, receiver) => {
  const web3 = new Web3(TestRPC.provider());

  let contract = Contract.find({name: "Sell"});
  web3.eth.defaultAccount = sender;

  let abiContract = web3.eth.contract(abi);
  let contract = abiContract.at(contract.address);
  var send = web3.eth.sendTransaction({from:receiver,to:contract.address, value:web3.toWei(0.05, "ether")});

  contract.setSeller(receiver);
  contract.buy();

  return {receiverBal: web3.eth.getBalance(receiver), senderBal: web3.eth.getBalance(sender)};

};
