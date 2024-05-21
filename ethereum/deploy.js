const HDWalletProvider = require("@truffle/hdwallet-provider");
const { Web3 } = require("web3");
const { abi, evm } = require("./compile");
//updated web3 and hdwallet-provider imports added for convenience

// deploy code will go here
const provider = new HDWalletProvider(
  "laugh cotton mouse relax spirit organ recall quiz rather final today fiscal",
  "https://sepolia.infura.io/v3/f5d322cbbaa5485696c518e6454c1b72"
);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log("Attempting to deploy from account", accounts[0]);

  const result = await new web3.eth.Contract(abi)
    .deploy({ data: evm.bytecode.object })
    .send({ gas: 1000000, from: accounts[0] });

  console.log(JSON.stringify(abi));
  console.log("Contract deployed to ", result.options.address);

  provider.engine.stop();
};
deploy();
