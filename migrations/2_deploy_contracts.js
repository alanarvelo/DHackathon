const SimpleStorage = artifacts.require("SimpleStorage");
const DHackathonFactory = artifacts.require("DHackathonFactory");
const DHackathon = artifacts.require("DHackathon");

module.exports = async function(deployer) {
  let DHName = 'First DHackathon';
  let ownerAcc = "0x8842889405538d65af95C0697288dFe6318830CE";

  await deployer.deploy(SimpleStorage);
  await deployer.deploy(DHackathonFactory);
  await deployer.deploy(DHackathon, 0, DHName, ownerAcc, 3, 1579190683);
};