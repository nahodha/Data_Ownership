const assert = require('assert'),
      ganache = require('ganache-cli'),
      Web3 = require('web3'),
      compiledSellFactory = require('../smart_contracts/build/SellFactory.json'),
      compiledSell = require('../smart_contracts/build/Sell.json');

require('events').EventEmitter.prototype.setMaxListeners(100);

const web3 = new Web3(ganache.provider());

let accounts;
let factory;
let sellAddress;
let sell;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  factory = await new web3.eth.Contract(JSON.parse(compiledSellFactory.interface))
    .deploy({ data: '0x' + compiledSellFactory.bytecode })
    .send({ from: accounts[0], gas: '1000000' });

  await factory.methods.createSellContract()
    .send({
      from: accounts[0],
      gas: '1000000'
    });

  const addresses = await factory.methods.getDeployedSellContracts().call();

  sellAddress = addresses[0];

  sell = await new web3.eth.Contract(
    JSON.parse(compiledSell.interface),
    sellAddress
  );
});


describe('Sell', () => {
  it('deploys a Sell and SellFactory', () => {
    assert.ok(factory.options.address);
    assert.ok(sell.options.address);
  });

  it('adds buyer and seller correctly', async() => {
    const addedBuyer = await sell.methods.addBuyer(accounts[1])
      .send({
        from: accounts[0],
        gas: '1000000'
      });

    assert(addedBuyer, 'Failed to add buyer and seller correctly!');

    const buyer = await sell.methods.buyer().call();
    const seller = await sell.methods.seller().call();

    assert.equal(accounts[0], buyer, 'No buyer added!');
    assert.equal(accounts[1], seller, 'No seller added!');
  });

  it('buy', async() => {
    await sell.methods.addBuyer(accounts[1])
      .send({
        from: accounts[0],
        gas: '1000000'
      });

    const bought = await sell.methods.buy()
      .send({
        value: web3.utils.toWei('0.01', 'ether'),
        from: accounts[0],
        gas: '1000000'
      });

    assert(bought, 'Failure buying goods!');
  });
});
