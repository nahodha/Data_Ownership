const path = require('path'),
      fs = require('fs'),
      solc = require('solc');


const minePath = path.resolve(__dirname, 'contracts', 'Mine.sol'),
      sellPath = path.resolve(__dirname, 'contracts', 'Sell.sol'),
      sourcePath = path.resolve(__dirname, 'contracts', 'Contracts.sol');

const mineSource = fs.readFileSync(minePath, 'utf8'),
      sellSource = fs.readFileSync(sellPath, 'utf8'),
      source = fs.readFileSync(sourcePath, 'utf8');

module.exports = solc.compile(sellSource, 1).contracts[':Sell'];
