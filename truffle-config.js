const path = require("path");

try {
  const env = require("./ENV_VARS.env.json")
 }
 catch (e) {
  console.log('the file "./ENV_VARS.env.json" has not been created, but it is not required for ganache deployments, only for testnet or mainnet deployments')
 }

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "app/src/contracts"),
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545, // Using ganache-cli as development network
      network_id: "*",
  },
    ganacheGUI: {
      host: "127.0.0.1",
      port: 9545, // Using ganache-gui as development network
      network_id: "*", // match any network
      websockets: true
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
