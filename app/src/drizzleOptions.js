import Web3 from "web3";
import SimpleStorage from "./contracts/SimpleStorage.json"
import DHackathonFactory from "./contracts/DHackathonFactory.json";
// import DHackathon from "./contracts/DHackathon.json";

const options = {
  web3: {
    block: false,
    customProvider: new Web3("HTTP://127.0.0.1:7545"),
  },
  contracts: [SimpleStorage, DHackathonFactory],
  events: {
    SimpleStorage: ["StorageSet"],
    DHackathonFactory: ["DHackathonCreated", "FundsWithdrawn", "OwnershipTransferred"],
  },
  // polls: {
  //   accounts: 1500,
  // },
};

export default options;
