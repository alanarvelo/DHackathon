const DHackathon = artifacts.require("DHackathon");
const DHackathonFactory = artifacts.require("DHackathonFactory");

const EH = require("./exceptionsHelpers.js");
const BN = web3.utils.BN;
const toWei = web3.utils.toWei;

const _name = "Test DHackathon"
const _prize = "3"

contract("DHackathon", accounts => {
  const _admin = accounts[0]
  const judge1 = accounts[1]
  const judge2 = accounts[2]
  const participant1 = accounts[3]
  const participant2 = accounts[4]
  const participant3 = accounts[5]

  let instance
  let users = {
    _admin: _admin,
    judge1: judge1,
    judge2: judge2,
    participant1: participant1,
    participant2: participant2,
    participant3: participant3,
  } // no es6 syntax available


  describe("Factory Design", async() => {

    it("is properly assigned to admin", async () => {
      let factory = await DHackathonFactory.new({from: accounts[9]})
      let tx = await factory.createDHackathon(_name, toWei(_prize, "ether"), {from: _admin, value: toWei("0.1", "ether")})

      instance = await DHackathon.at(tx.logs[0].args.contractAddress)
      
      let DHAdmin = await instance.admin()

      assert.equal(DHAdmin, _admin, "Caller of factory.createDHackathon is not the DHackathon admin");
    });

    it("factory owner has no rights on DHackathon functions", async () => {
      let factory = await DHackathonFactory.new({from: accounts[9]})
      let tx = await factory.createDHackathon(_name, _prize, {from: _admin, value: toWei("0.1", "ether")})

      instance = await DHackathon.at(tx.logs[0].args.contractAddress)//.admin.call();

      await EH.catchRevert(instance.openDHackathon({from: accounts[9], value: toWei("3", "ether")}));
    });

    it("admin can operate contract properly", async () => {
      let factory = await DHackathonFactory.new({from: accounts[9]})
      let tx = await factory.createDHackathon(_name, _prize, {from: _admin, value: toWei("0.1", "ether")})

      instance = await DHackathon.at(tx.logs[0].args.contractAddress)//.admin.call();

      let preState = await instance.state()
      await instance.openDHackathon({from: _admin, value: toWei("3", "ether")})
      let postState = await instance.state()

      assert.equal((preState, postState), (0, 1), "Contract stated did not change from InPreparation to Open");
    });

  });


  //---------------------------------- InPreparation ---------------------------------//
  describe("DHackathon Functionality —— InPreparation", async() => {
    // DHackathon constructor receives DHID, name, admin, prize, createdOn
    beforeEach(async () => {
      instance = await DHackathon.new(1, _name, _admin, toWei(_prize, "ether"), Date.now())
    })
    
    it("is properly assigned to admin", async () => {
      let DHAdmin = await instance.admin()
      assert.equal(DHAdmin, _admin, "DHackathon admin not assigned correctly");
    });

    it("is `InPreparation` state", async () => {
      let state = await instance.state()
      assert.equal(state, 0, "DHackathon is not in the expected `InPreparation` state");
    });
    
    it("anyone can submit funds for prize", async () => {
      await instance.submitFunds({from: accounts[6], value: toWei("1", "ether")})
      await instance.submitFunds({from: accounts[7], value: toWei("1", "ether")})

      let contractBalance = await web3.eth.getBalance(instance.address)

      assert.equal(contractBalance, toWei("2", "ether"), "The funds sent don't match the contract's balance");
    });

    it("must meet prize to change state to Open", async () => {
      await instance.submitFunds({from: accounts[6], value: toWei("1", "ether")})
      await instance.submitFunds({from: accounts[7], value: toWei("1", "ether")})

      await EH.catchRevert(instance.openDHackathon({from: _admin}))
    });

    it("can add judges", async () => {
      await instance.addJudge(judge1, {from: _admin})
      let isJudge = await instance.isJudge(judge1);
      assert.equal(isJudge, true, "Judge not added correctly")
    });

    it("added judges are recorded in array", async () => {
      await instance.addJudge(judge1, {from: _admin})
      await instance.addJudge(judge2, {from: _admin})

      let judgesList = await instance.getJudgesList()
      let allIncluded = (judgesList.includes(judge1) && judgesList.includes(judge2))
      assert.equal(allIncluded, true, "Judge not recorded correctly in array")
    });

    it("can remove judges", async () => {
      await instance.addJudge(judge1, {from: _admin})
      await instance.removeJudge(judge1, {from: _admin})
      let isJudge = await instance.isJudge(judge1);
      assert.equal(isJudge, false, "Judge not removed correctly")
    });

    it("removed judges are deleted from array", async () => {
      await instance.addJudge(judge1, {from: _admin})
      await instance.addJudge(judge2, {from: _admin})
      await instance.removeJudge(judge1, {from: _admin})

      let judgesList = await instance.getJudgesList()
      console.log(judgesList.includes(judge1), judgesList.includes(judge2))
      let included = (!judgesList.includes(judge1) && judgesList.includes(judge2))
      assert.equal(included, true, "Judge not deleted correctly from array")
    });

    it("participants can register", async () => {
      await instance.registerAsParticipant({from: participant1})
      let isParticipant = await instance.isParticipant(participant1);
      assert.equal(isParticipant, true, "Participant not registered correctly")
    });

    it("added participants are recorded in array", async () => {
      await instance.registerAsParticipant({from: participant1})
      await instance.registerAsParticipant({from: participant2})

      let participantsList = await instance.getParticipantsList()
      let allIncluded = (participantsList.includes(participant1) && participantsList.includes(participant2))
      assert.equal(allIncluded, true, "participants not recorded correctly in array")
    });

    it("participants can deregister", async () => {
      await instance.registerAsParticipant({from: participant1})
      await instance.deregisterAsParticipant({from: participant1})
      let isParticipant = await instance.isParticipant(participant1);
      assert.equal(isParticipant, false, "Participant not deregistered correctly")
    });

    it("deregistered participants are deleted from array", async () => {
      await instance.registerAsParticipant({from: participant1})
      await instance.registerAsParticipant({from: participant2})
      await instance.deregisterAsParticipant({from: participant1})

      let participantsList = await instance.getParticipantsList()
      let allIncluded = (!participantsList.includes(participant1) && participantsList.includes(participant2))
      assert.equal(allIncluded, true, "deregistered participants not deleted correctly from array")
    });

    it("properly changes to Open state", async () => {
      // someone submits part of prize
      await instance.submitFunds({from: accounts[6], value: toWei("2", "ether")})
      // admin adds 2 judges
      await instance.addJudge(judge1, {from: _admin})
      await instance.addJudge(judge2, {from: _admin})
      // 3 participants register
      await instance.registerAsParticipant({from: participant1})
      await instance.registerAsParticipant({from: participant2})
      await instance.registerAsParticipant({from: participant3})
      // admin submits remainder of prize and opens the DHackathon
      instance.openDHackathon({from: _admin, value: toWei("1", "ether")})
      // check if state is Open
      let state = await instance.state()
      assert.equal(state, 1, "DHackathon is not in the expected `Open` state");
    });

  });


  //------------------------------------- Open ---------------------------------------//
  describe("DHackathon Functionality —— Open", async() => {
    // DHackathon is taken to Open state by adding prize, judges, and participants
    beforeEach(async () => {
      // create new instance
      instance = await DHackathon.new(1, _name, _admin, toWei(_prize, "ether"), Date.now())
      await setToOpenHelper(instance, users)
    })

    it("is in `Open` state", async () => {
        let state = await instance.state()
        assert.equal(state, 1, "DHackathon is not in the expected `Open` state");
      });
    
    it("participants can submit projects", async () => {
      let _url = "https://github.com/alanarvelo/starRegistryDApp"
      await instance.submitProject(_url, {from: participant1});
      let project = await instance.viewProject({from: participant1})
      assert.equal(project[0], _url, "Project was not properly submitted");
    });

    it("properly changes to InVoting state", async () => {
      // 3 participants submit their projects
      await instance.submitProject("https://github.com/participant1/testProject", {from: participant1})
      await instance.submitProject("https://github.com/participant2/testProject", {from: participant2})
      await instance.submitProject("https://github.com/participant3/testProject", {from: participant3})
      // admin submits remainder of prize and opens the DHackathon
      await instance.toVotingDHackathon({from: _admin})
      // check if state is InVoting
      let state = await instance.state()
      assert.equal(state, 2, "DHackathon is not in the expected `InVoting` state");
    });
    
  });


  //------------------------------------- InVoting ---------------------------------------//
  describe("DHackathon Functionality —— InVoting", async() => {
    // DHackathon is taken to InVoting state by participants submitting their projects
    beforeEach(async () => {
      // create new instance
      instance = await DHackathon.new(1, _name, _admin, toWei(_prize, "ether"), Date.now())
      await setToInVotingHelper(instance, users)
    })

    it("is `InVoting` state", async () => {
      let state = await instance.state()
      assert.equal(state, 2, "DHackathon is not in the expected `InVoting` state");
    });

    it("judge can vote", async () => {
      await instance.submitVote(participant1, {from: judge1});
      let project = await instance.viewProject({from: participant1})
      assert.equal(project[1], 1, "Project did not receive vote");
    });

    it("judge can't vote twice", async () => {
      await instance.submitVote(participant1, {from: judge1});
      await EH.catchRevert(instance.submitVote(participant2, {from: judge1}));
    });

    it("properly changes to InVoting state", async () => {
      // the 2 judges submit their votes
      await instance.submitVote(participant1, {from: judge1});
      await instance.submitVote(participant1, {from: judge2});
      // admin submits remainder of prize and opens the DHackathon
      await instance.closeDHackathon({from: _admin})
      // check if state is Closed
      let state = await instance.state()
      assert.equal(state, 3, "DHackathon is not in the expected `Closed` state");
    });

  });


  //------------------------------------- Closed ---------------------------------------//
  describe("DHackathon Functionality —— Closed", async() => {
    // DHackathon is taken to Closed state by judges submitting their votes
    beforeEach(async () => {
      // create new instance
      instance = await DHackathon.new(1, _name, _admin, toWei(_prize, "ether"), Date.now())
      await setToClosedHelper(instance, users)
    })

    it("is in `Closed` state", async () => {
      let state = await instance.state()
      assert.equal(state, 3, "DHackathon is not in the expected `Closed` state");
    });

    it("participants who got votes can withdraw prize", async () => {
      const preWithdrawAmount = await web3.eth.getBalance(participant1);
      let receipt =  await instance.withdrawPrize({from: participant1});
      const postWithdrawAmount = await web3.eth.getBalance(participant1);

      let TXreceipt = await web3.eth.getTransaction(receipt.tx);
      let TXCost = Number(TXreceipt.gasPrice) * receipt.receipt.gasUsed;

      let expectedPostAmount = (new BN(preWithdrawAmount)
                              // plus the prize divided by 2, as participant 1 got 1/2 of all votes
                              .add(new BN(toWei(_prize, "ether")).div(new BN(2)))
                              .sub(new BN(TXCost))).toString()

      assert.equal(postWithdrawAmount, expectedPostAmount)
    });

    it("participants cannot withdraw prize twice", async () => {
      await instance.withdrawPrize({from: participant1});
      await EH.catchRevert(instance.withdrawPrize({from: participant1}));
    });

    it("participants who did not get votes cannot withdraw prize", async () => {
      await EH.catchRevert(instance.withdrawPrize({from: participant3}));
    });

  });

});


// HELPERS 
async function setToOpenHelper(instance, users) {
  // admin adds 2 judges
  await instance.addJudge(users.judge1, {from: users._admin})
  await instance.addJudge(users.judge2, {from: users._admin})
  // 3 participants register
  await instance.registerAsParticipant({from: users.participant1})
  await instance.registerAsParticipant({from: users.participant2})
  await instance.registerAsParticipant({from: users.participant3})
  // admin submits funds for prize and opens the DHackathon
  await instance.openDHackathon({from: users._admin, value: toWei(_prize, "ether")})
}

async function setToInVotingHelper(instance, users) {
  await setToOpenHelper(instance, users)
  // 3 participants submit their projects
  await instance.submitProject("https://github.com/participant1/testProject", {from: users.participant1})
  await instance.submitProject("https://github.com/participant2/testProject", {from: users.participant2})
  await instance.submitProject("https://github.com/participant3/testProject", {from: users.participant3})
  // admin submits remainder of prize and opens the DHackathon
  await instance.toVotingDHackathon({from: users._admin})
}

async function setToClosedHelper(instance, users) {
  await setToInVotingHelper(instance, users)
  // the 2 judges submit their votes
  await instance.submitVote(users.participant1, {from: users.judge1});
  await instance.submitVote(users.participant2, {from: users.judge2});
  // admin sets state to Closed DHckathon
  await instance.closeDHackathon({from: users._admin})
}