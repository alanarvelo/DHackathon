import Web3 from "web3";
import DHackathonFactory from "./contracts/DHackathonFactory.json";
import DHackathon from "./contracts/DHackathon.json";

const options = {
  web3: {
    block: false,
    fallback: {
      case: 'ws',
      url: "HTTP://127.0.0.1:9545"
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



