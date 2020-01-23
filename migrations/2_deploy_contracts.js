const DHackathonFactory = artifacts.require("DHackathonFactory");
const DHackathon = artifacts.require("DHackathon");
const toWei = web3.utils.toWei;
  // let DHName = 'DH0';
  // let ownerAcc = "0x8842889405538d65af95C0697288dFe6318830CE";


module.exports = async function(deployer) {
  await deployer.deploy(DHackathonFactory);
};