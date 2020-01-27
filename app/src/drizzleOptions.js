import Web3 from "web3";
import DHackathonFactory from "./contracts/DHackathonFactory.json";

const options = {
  web3: {
    block: false,
    custoProvider: window.web3.currentProvider, // experimental
    fallback: {
      case: 'ws',
      url: "HTTP://127.0.0.1:8545"
    }
  },
  contracts: [DHackathonFactory],
  events: {
    DHackathonFactory: ["DHackathonCreated", "FundsWithdrawn", "OwnershipTransferred"],
  },
  // polls: {
  //   // accounts: 1500,
  //   blocks: 1500
  // },
};

export default options;



