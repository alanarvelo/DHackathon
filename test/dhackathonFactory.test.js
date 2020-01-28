const DHackathonFactory = artifacts.require("DHackathonFactory");

const EH = require("./exceptionsHelpers.js");
const BN = web3.utils.BN;
const toWei = web3.utils.toWei;

contract("DHackathonFactory", async accounts => {

  const _owner = accounts[0]
  const _admin1 = accounts[1]
  const _admin2 = accounts[2]

  let _name = "Test DHackathon"
  let _prize = 10
  let instance

  beforeEach(async () => {
    instance = await DHackathonFactory.new();
  })

    // it("Deploys succesfully and operational", async () => {
    //   let _operational = await instance.operational.call({from: _owner})
    //   let _counter = await instance.counter.call({from: accounts[9]})
    //   assert.equal((_operational, _counter), (true, 0), "Contract properly deployed or not operational");
    // });

    // it("It does NOT create a new DHackathon if fee is not payed", async () => {
    //   await EH.catchRevert(instance.createDHackathon(_name, _prize, {from: _admin1}));
    // });

    it("Creates a new DHackathon when fee is payed", async () => {
      let tx = await instance.createDHackathon(_name, _prize, {from: _admin1, value: toWei("0.1", "ether")});
      let children = await instance.getChildren();
      console.log("TX: ", tx.logs[0].args.contractAddress)
      console.log("children: ", children)
      // assert.equal((newDH['DHID'], newDH['admin']), (1, _admin1), "DHackathon was not created properly");
    });

    // it("It reverts if Circuit Breaker is open (not operational)", async () => {
    //   await instance.shutdown({from: _owner});
    //   await EH.catchRevert(instance.createDHackathon(_name, _prize, {from: _admin1, value: toWei("0.1", "ether")}));
    // });

    // it("Owner can withdraw funds generated from DHackathon initialization fees", async () => {
    //   await instance.createDHackathon(_name, _prize, {from: _admin1, value: toWei("0.1", "ether")});
    //   await instance.createDHackathon("Test DHackaton 2", 20, {from: _admin2, value: toWei("0.1", "ether")});
      
    //   const preWithdrawAmount = await web3.eth.getBalance(_owner);
    //   let receipt = await instance.withdrawFunds({from: _owner});
    //   const postWithdrawAmount = await web3.eth.getBalance(_owner);

    //   let TXreceipt = await web3.eth.getTransaction(receipt.tx);
    //   let TXCost = Number(TXreceipt.gasPrice) * receipt.receipt.gasUsed;

    //   let expectedPostAmount = (new BN(preWithdrawAmount).add(new BN(toWei("0.2", "ether"))).sub(new BN(TXCost))).toString()

    //   assert.equal(postWithdrawAmount, expectedPostAmount)
    // });

});
