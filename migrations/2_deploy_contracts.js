const DHackathonFactory = artifacts.require("DHackathonFactory");
const DHackathon = artifacts.require("DHackathon");
// const DHackathon2 = artifacts.require("DHackathon");
const toWei = web3.utils.toWei;
  


module.exports = async function(deployer) {
  // development usage, start with a DHackathon instantiated
  let DHName = 'Identity Competition';
  let ownerAcc = "0x8842889405538d65af95C0697288dFe6318830CE";

  await deployer.deploy(DHackathonFactory);
  await deployer.deploy(DHackathon, 0, DHName, ownerAcc, toWei("10", "ether"), 1580163693);
  await deployer.deploy(DHackathon, 1, DHName, ownerAcc, toWei("5", "ether"), 1580163693);
};