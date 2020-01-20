const DHackathonFactory = artifacts.require("DHackathonFactory");
const DHackathon = artifacts.require("DHackathon");
const toWei = web3.utils.toWei;


module.exports = async function(deployer) {
  let DHName = 'DH0';
  let ownerAcc = "0x8842889405538d65af95C0697288dFe6318830CE";

  await deployer.deploy(DHackathonFactory);
  await deployer.deploy(DHackathon, 0, DHName, ownerAcc, toWei(".5", "ether"), 1579190683);
};