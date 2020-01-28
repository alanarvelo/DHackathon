const DHackathonFactory = artifacts.require("DHackathonFactory");
const DHackathon = artifacts.require("DHackathon");
const toWei = web3.utils.toWei;
  


module.exports = async function(deployer) {
  let DHName = 'Identity Competition';
  let ownerAcc = "0x07A8646fdEc5BFa397Bb1c1879217Fca734F41Fb";

  await deployer.deploy(DHackathonFactory);
  // await deployer.deploy(DHackathon, 0, DHName, ownerAcc, toWei("10", "ether"), 1580163693);
};