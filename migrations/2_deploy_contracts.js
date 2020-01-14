const SimpleStorage = artifacts.require("SimpleStorage");
const DHackathonFactory = artifacts.require("DHackathonFactory");
const DHackathon = artifacts.require("DHackathon");

module.exports = async function(deployer) {
  let DHName = 'Test 11';
  let ownerAdd = '0xe27d5e15d40963ccf2e33a8ba6992b36d456231b';

  await deployer.deploy(SimpleStorage);
  await deployer.deploy(DHackathonFactory);
  await deployer.deploy(DHackathon, 11, DHName, ownerAdd, 3, 33);
};