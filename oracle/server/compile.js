const path = require('path'),
      fs = require('fs-extra'),
      solc = require('solc');

// Create build directory if it does not exist
const buildPath = path.resolve(__dirname, 'build');

// fs.ensureDirSync(__dirname + './build', (err) => {
//   if (err)
//     console.error('Directory could not be created!\n\n' + err);

  fs.removeSync(buildPath);
// });

const minePath = path.resolve(__dirname, 'contracts', 'Mine.sol'),
      sellPath = path.resolve(__dirname, 'contracts', 'Sell.sol');

const mineSource = fs.readFileSync(minePath, 'utf8'),
      sellSource = fs.readFileSync(sellPath, 'utf8');

let mineOutput = solc.compile(mineSource, 1).contracts;
let sellOutput = solc.compile(sellSource, 1).contracts;

let outputs = [mineOutput, sellOutput];

fs.ensureDirSync(buildPath);
for (let i = 0; i < outputs.length; i++) {
  for (let contract in outputs[i]) {
    fs.outputJSONSync(
      path.resolve(buildPath, contract.replace(':', '') + '.json'),
      outputs[i][contract]
    );
  }
}
