const path = require("path");
require('dotenv').config()

const HDWalletProvider = require("@truffle/hdwallet-provider");

module.exports = {
  contracts_build_directory: path.join(__dirname, "app/src/abis"),
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,               // Using ganache-cli as development network
      network_id: "*",          // Match any network id
  },
    ganacheGUI: {
      host: "127.0.0.1",
      port: 9545,               // Using ganache-gui as development network
      network_id: "5777",       // Match a specific ID
      websockets: true
    },
    ropsten: {
      provider: () => new HDWalletProvider(process.env.MNEMONIC, "https://ropsten.infura.io/v3/" + process.env.INFURA_API_KEY),
      network_id: 3,
      gas: 6000000,
      gasPrice: 10000000000
    },
    rinkeby: {
      provider: () => new HDWalletProvider(process.env.MNEMONIC, "https://rinkeby.infura.io/v3/" + process.env.INFURA_API_KEY),
      network_id: 4,
      gas: 6000000,
      gasPrice: 10000000000
    },
    // main ethereum network(mainnet)
    main: {
      provider: () => new HDWalletProvider(process.env.MNEMONIC, "https://mainnet.infura.io/v3/" + process.env.INFURA_API_KEY),
      network_id: 1,
      gas: 6000000,
      gasPrice: 1000000000
    }
  },
  compilers: {
    solc: {
      version: "0.5.11",    // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      // settings: {          // See the solidity docs for advice about optimization and evmVersion
       optimizer: {
         enabled: false,
         runs: 200
       },
      //  evmVersion: "byzantium"
      }
    }
};
