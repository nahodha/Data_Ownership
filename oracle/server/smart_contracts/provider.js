const Web3 = require('web3'),
      HDWalletProvider = require('truffle-hdwallet-provider'),
      TestRPC = require('ethereumjs-testrpc');

let web3;

if (process.env.NODE_ENV == 'prod') {
  const provider = new HDWalletProvider(process.env.SEED_WORDS, process.env.INFURA);
  web3 = new Web3(provider);
}

if (process.env.NODE_ENV == 'test') {
  web3 = new Web3(TestRPC.provider());
}

if (process.env.NODE_ENV == 'dev') {
  web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
}

module.exports = web3;
