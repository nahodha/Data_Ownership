const assert = require('assert'),
      ganache = require('ganache-cli'),
      Web3 = require('web3'),
      compiledMineFactory = require('../build/MineFactory.json'),
      compiledMine = require('../build/Mine.json');

require('events').EventEmitter.prototype.setMaxListeners(100);

const web3 = new Web3(ganache.provider());

let accounts;
let factory;
let mineAddress;
let mine;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  factory = await new web3.eth.Contract(JSON.parse(compiledMineFactory.interface))
    .deploy({ data: '0x' + compiledMineFactory.bytecode })
    .send({ from: accounts[0], gas: '1000000' });

  await factory.methods.createMineContract()
    .send({
      from: accounts[0],
      gas: '1000000'
    });

  const addresses = await factory.methods.getDeployedMineContracts().call();

  mineAddress = addresses[0];

  mine = await new web3.eth.Contract(
    JSON.parse(compiledMine.interface),
    mineAddress
  );
});


describe('Mine', () => {
  it('deploys a Mine and MineFactory', () => {
    assert.ok(factory.options.address);
    assert.ok(mine.options.address);
  });

  it('adds Miner correctly', async() => {
    const addedMiner = await mine.methods.addMiner(accounts[0])
      .send({
        from: accounts[0],
        gas: '1000000'
      });

    assert(addedMiner, 'Miner was not added correctly!');

    const miner = await mine.methods.miner().call();
    assert.equal(accounts[0], miner, 'Miner was not added!');
  });

  it('adds data owner to the contract', async () => {
    const addDataOwner = await mine.methods.allowMine()
      .send({
        from: accounts[1],
        gas: '1000000'
      });

    assert(addDataOwner, 'Data Owner not added correctly!');

    const dataOwner = await mine.methods.dataOwners(accounts[1]).call();
    assert.equal(true, dataOwner, 'Data Owner not true so not added correctly!');
  });

  it('start mining process', async() => {
    await mine.methods.addMiner(accounts[0])
      .send({
        from: accounts[0],
        gas: '1000000'
      });

    await mine.methods.allowMine()
      .send({
        from: accounts[1],
        gas: '1000000'
      });

    const mined = await mine.methods.startMine()
      .send({
        value: web3.utils.toWei('2', 'ether'),
        from: accounts[0],
        gas: '1000000'
      });

    assert(mined, 'Mining failed!');
  });

  it('pay data owners', async() => {
    await mine.methods.addMiner(accounts[0])
      .send({
        from: accounts[0],
        gas: '1000000'
      });

    await mine.methods.allowMine()
      .send({
        from: accounts[1],
        gas: '1000000'
      });

    await mine.methods.startMine()
      .send({
        value: web3.utils.toWei('2', 'ether'),
        from: accounts[0],
        gas: '1000000'
      });

    const payOwners = await mine.methods.payDataOwners()
      .send({
        from: accounts[1],
        gas: '1000000'
      });

    assert(payOwners, 'Data owners payment failed!');
  });
});
