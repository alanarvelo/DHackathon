import Web3 from "web3";
import SimpleStorage from "./contracts/SimpleStorage.json"
import DHackathonFactory from "./contracts/DHackathonFactory.json";
import DHackathon from "./contracts/DHackathon.json";

const options = {
  web3: {
    block: false,
    currentProvider: new Web3("HTTP://127.0.0.1:9545"), // new Web3.providers.HttpProvider('http://localhost:9545')
    // customProvider: new Web3.providers.HttpProvider('http://localhost:9545'),
    // defaultProvider: new Web3("HTTP://127.0.0.1:9545")
  },
  contracts: [DHackathonFactory, DHackathon],
  events: {
    // SimpleStorage: ["StorageSet"],
    DHackathonFactory: ["DHackathonCreated", "FundsWithdrawn", "OwnershipTransferred"],
  },
  // polls: {
  //   accounts: 1500,
  // },
};

export default options;
