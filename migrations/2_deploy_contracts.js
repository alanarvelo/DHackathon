const SimpleStorage = artifacts.require("SimpleStorage");
const DHackathonFactory = artifacts.require("DHackathonFactory");
// const DHackathon = artifacts.require("DHackathon");

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(DHackathonFactory);
    // deployer.deploy(DHackathon);
};