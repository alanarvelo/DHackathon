![diagram](./UML/UML_state_diagram_simplified.png)

# Welcome to Decentralized Hackathons!
---

This is the official [DeHack]() repository holding:
+ smart contracts — back end
+ web application — front end

### What is DeHack?

[DeHack]() is a platform to create and manage decentralized hackathons based on smart contracts on Ethereum. Anyone can add a prize to a new competition and encourage participants to create and compete.

### What can you do with DeHack?

Using DeHack you can:
+ Create a new hackathon
+ Collect the prize (bounty) of a hackathon
+ Submit a project to a hackathon
+ Vote for a project on a hackathon
+ Retrieve part of the prize from a hackathon

Note that hackathons, and all competitions, are group efforts where certain individuals have certain responsibilities. DeHack is no exception, below is a description of the roles an individual can have and the stages hackathons go through.

---

## Description

Because an image is worth more than a thousand words:

![sequence diagram](./UML/UML_sequence_diagram.png)

The platform is based on two main contracts that have a factory-child relationship, the `DHackathonFactory` contract and the `DHackathon`, DHackathon standing for Decentralized Hackathon. Any externally owned account (EOA) can call the `createDHackathon(string memory _name, uint256 _prize)` function of the `DHackathonFactory` contract to instantiate and become the _Admin_ of a newly minted `DHackathon` contract (more on _Admin_ and roles below). The caller must specify what `name` and `prize` the `DHackathon` will have. The contract's balance will have to be greater or equal to the promised `prize` for the `DHackathon` contract to change to the `Open` stage (more on _Open_ and stages below).

### Stages

Each hackathon has 4 types of users: _Admin_, _Participant_, _Judge_ everyone else (_No role_). Function access is restricted via modifiers to EOA's with the appropriate roles. Roles are exclusive, the same EOA can hold two roles, e.g. the _Admin_ can't be a _judge_, nor can a _judge_ be a _participant_.

+ **Admin:**  in charge of adding and removing judges and moving the contract through its stages (_In Preparation_, _Open_, _In Voting_, _Closed_, more on stages below).
+ **Participant:** submit a link to their project and withdraw a piece of the prize if they got any votes from judges.
+ **Judge:** review the submitted projects and vote for their elected winner.
+ **Anyone:** regiser as a participant (gaining participant role access, i.e. can participate in the hackathon by submitting a project).

Any EOA, including ones with assigned roles, can `submitFunds()` that will be accumulated in the `DHackathon` contract as the prize to be withdrawn by the winners.

### Stages

The stages of a hackathon are sequentially: _In Preparation_, _Open_, _In Voting_, _Closed_. The _Admin_ is in charge of moving the hackathon through its stages. Function access is restricted so that the hackathon is in the expected stage when X is activity is about to happen. For example, Participants can only register on the _In Preparation_ stage, and Judges can only vote on the _In Voting_ stage. An explanation of what each role can do in each stage can be found below.

+ **In Preparation:** contract starts on this stage.
  + *Admin:* add and remove judges, and set the stage to _Open_.
  + *Participant:* deregister, abandoning their role.
  + *Judge:* -
  + *No role:* register as a participant.
+ **Open:** contract balance must be >= than the declared _prize_. At least 1 judge and 2 participants must have registered.
  + *Admin:* remove judges, and set the stage to _inVoting_.
  + *Participant:* can submit a project, and deregister.
  + *Judge:* -
  + *No role:* -
+ **In Voting:** 
  + *Admin:* remove judges, and set the stage to _Closed_.
  + *Participant:* de-register.
  + *Judge:* can submit a vote.
  + *No role:* -
+ **Closed:** at least 1 vote must have been submitted. 
  + *Admin:* -
  + *Participant:* can withdraw prize, if they have received votes.
  + *Judge:* -
  + *No role:* -

With the caveat, that anyone, with role or without role, can call `submitFunds`, `balance`, `isAdmin` at any stage.

For a more techncial description of the above see [design pattern decisions](./design_pattern_decisions.md) and [avoiding common attacks](./avoiding_common_attacks.md).

### Objective & Benefits

**Objective:**
This project was born out of the ironic experiencee of participating in a _blockchain_ \& _Web3_ hackathon conducted in a centralized manner and the prize was delivered 2 weeks after in _fiat_ money. The purpose therefore is to help transition hackathons and other competitions to a decentralized manner thus benefitting from the transparency, immediacy, and anti-tampering, capabilities provided by blockchain back-ends.

**Benefits:**
Notice the _Admin_ has no power on the selection of the winner or the delivery of the prize. To further decentralize this platform the stage changes can be time based and the election of judges can be done via voting. See the Design _Considerations & Next Features_ section for more.

+ Transparency: 
  + anyone, at any point, knows the same as everyone else.
  + anyone can participate
+ Anti-tampering:
  + actors are anonymous reducing unconcious biases and/or discrimination
  + votes are anonymous and automated reducing tampering possibilities 
  + the prize is not controlled by a centralized authority
+ Immediacy:
  + the prize is immediately available to the voted winners

---

## Live Demo

hosted here

videos here

medium here

---

## Design Considerations & Next Features

#### Moving hackathon through stages

Currently, the _Admin_ is reponsible for moving the `DHackathon` contract, which  represents a hackathon in the Ethereum blockchain, through its stages by calling the functions:  `openDHackathon()`, `toVotingDHackathon()`, and `closeDHackathon()`.
Given that at creation, each `DHackathon` contract gets a _createdOn_ property, these stage changes can be time based. The contract can last a fixed number of days on each stage, or the user can define the length of each stage at creation.

**To do:** time-based state management.

#### Project submission

Project submissions are currently simple, a _url_ string is all the is required from the participants in the `submitProject(string memory _url)` function. This _url_ is expected to be a **github** link to the project's repository, and there is nothing currently stopping participants from making updates to their projects past the _Open_ stage. Though, github does timestamp each commit. More sophisticated ways of submitting and storing a project can be devised. A simple addition would be to timestamp when the project's url at submission, though how will this prevent particpants from updating the url's content is still unclear. Hashing may be the way, though help is required here.

The projects struct is below:
```
struct Project {
        string url;
        uint128 votes;
        bool withdrewPrize;
    }
mapping (address => Project) public projects;
```

**To do:** timestamp projects at submission and require a hash of its content.

#### Voting mechanism

Currently each judge has one vote to grant to one participant, the vote is `+= 1` for the elected participant votes count. The judges can only call the `submitVote(address _electedWinner)` function once. More complex voting mechnism where the `DHackathon` can have judging criterias or themes to be evaluated on and judges can vote different amounts to different participants on different criterias. These would allow for calculating a podium, i.e. select the winners as a 1st, 2nd, and 3rd place, which more closely resembles centralized hackathons.

**To do:** add judging criterias and calculate winners podium-style (1st, 2nd, 3rd place).

#### Prize division

Withdrawal design pattern is used here, winners must call the `withdrawPrize` function to receive their portion of the prize. The prize is divided equally by the number of votes given out by judges and awarded to participants based on the number of votes received. On code:
```
/// Inside the closeDHackathon function
prizePortion = address(this).balance.div(numJudgesWhoVoted);
...
/// Inside the withdrawPrize function
uint256 amount = winner.votes.mul(prizePortion);
```

**To do:** code a more complex and customizable prize distribution mechanism according to improved voting logic.


#### Participants and teams

Currently participants are represented by EOA's only. Would be great to add functionality for having _teams_ that consist of several EOA's, submit a projects together and share the prize. Other options are to have participants get approved or charge a fee for participating (similar to a betting format).

**To do:** add _teams_ functionality.

#### Adding and removing Judges

Another of the big responsibilities of the _Admin_ is to select the judges. However, on the _In Preparation_ period, there can be a voting process for the community, particpants and No roles, to vote for who they want their judge to be, based on the theme of the `DHackathon` aligning with that individual's expertise. The EOA of that individual must be known. 

**To do:** allow judge selection via voting process of the community.

#### Sponsor role

A Sponsor role can be assigned to anyone who submits funds or who submits more then X funds. The sponsor role could have tiers depending on the donation. Companies, will be interested in the publicity and functionality of the Sponsor role if it is designed to be appealing enough for them.

**To do:** add a Sponsor role for EOA's that submit funds and add relevant functionality.

#### Extend to any type of competition

As can be seen, hackathons are just one kind of competition that can be decentralized. Roles, _Admin_, _Participant_, _Judge_ are agnosticly named so these contracts functionality can be easily expnded to other types of competitions. Competitions need not be online, they can have a physical component and still benefit from decentralized registration, prize funding, judge selection, voting, and prize disbursal.

Any sort of tournament: poker, esports, ping pong, or art competitions can leverage this workflow.

**To do:** generalize functionality to provide registration, prize funding, judge selection, voting, and prize disbursal to any type of competition.


#### Other To-do's:
- Host the front-end on IPFS
- Add capability for the Ethereum Name Service (ENS)
- Auth \& signing with Uport and Blockstack

- Allow proper login, MM-enable, with the MM button
- Track connected network

- Dont remove pop-up until interaction with MM is achieved, and show loading button
- form validation for EOA for judges, participants, etc
- Block OpenDHFn if balance not great to Prize   
- change size and beautify of DHackathon components instructions
- Allow to submit funds along with OpenDH call

- After DH creation redirect to new DH page 
- make input size variable
- Add Loading Container
- specific event configuration for each type of event to display its returned values
- make the contracts upgradeable
- Make factory contract (and DHackathon ones) Mortal and/or Autodeprecation
- Separate to new test file the state set-up functions
- Deployable to with Hyperledger Besu private network
- Separate the DH UI into componenets, only show compoenent relevant to role

---

## Getting Started

Below is a technical explanation of how to copy the project and run a local version of it in your machine. If you just want to play with the live, finished platform find it here [DeHack](). If you want to study & improve the platform by getting a local copy, please read on.

#### Prerequisities
The platform runs on the following version of these frameworks. 

* `node v8.12.0`
* `npm@6.4.1`
* `truffle@5.0.32`
* `ganache-cli@6.6.0`

[NodeJS](https://github.com/nodejs/node) as a compilation engine to run scripts. 

[NPM](https://github.com/npm/cli), as a package manager.

Check if you have node and npm by typing in your terminal:
```sh
$ node -v
$ npm -v
```
If you don't yet have them, you can install them from [here](https://nodejs.org/en/). Npm typically comes with NodeJS, but make sure you have them both.

[Truffle](https://github.com/trufflesuite/truffle) for everything related to writing, testing, compiling, and deploying smart contracts.

[Ganache-CLI](https://github.com/trufflesuite/ganache-cli) to create a private blockchain to work during development (port 8545). I also utilized Ganache-GUI extensively,thus it will be set-up for you at port 9545.

Truffle and ganache-cli can be installed by running these commands in your terminal. Ganache-GUI can be downloaded from [here](trufflesuite.com/ganache).
```sh
$ npm install -g truffle
$ npm install -g ganache-cli
```
 
[Metamask](https://metamask.io/) to interact with the dApp. It is a browser extension and can be easily installed following these [steps](https://metamask.io/).


#### Installing

Clone the repository to your local machine by:
```sh
$ git clone https://github.com/alanarvelo/DHackathon.git
```

#### Running the project

Once cloned you can get into the project's root path

#### Libraries & Dependencies
![data and dependencies diagram](./UML/UML_data_modeling.png)

#### Tests

Tests can be run by typing in the terminal
```sh
truffle test
```
That's it!, test takes time but all of them can be completed with some patience. Here an example of how much time they take to complete:

#### Deployment

The platform can be deployed to Rinkeby, Ropsten, other testnets, as well as to ethereum's Mainnet. In fact, it already has, see the deployed addresses [here](./deployed_addresses.txt").

To deploy it yourself create a file called `ENV_VARS.env.json` and add your [Infura](https://infura.io/) provider for the network you want to deploy and
mnemonic information as follows.
```
{
  "MNEMONIC":"",
  "RINKEBY_INFURA_PROVIDER":"",
  "ROPSTEN_INFURA_PROVIDER":"",
  "MAINNET_PROVIDER":""
}
```
**Important:**  the file must have the extension `.env.json` so it is ignored by `.gitignore`, thus preventing you from accidentally disclosing your mnemonic and thus your private keys. If you are not interested on deploying to a particular network, you can leave its provider value as an empty string (`""`).

To deploy to testnets or mainnet, run:

```
truffle deploy --network <yourPreferedNetwork>
```

---


To Remember:
  - On video demo, mention all the TO-DO/Nice-to-haves and explain how this can be generalized for any type of competition
      enforce expected prize
  - On video, end with a shameless plug to get hired
  

  - Update Balance display after submitFunds runs    ----- DONE
  - Not found DH page, reroute or error    ------- DONE
  - NavBAr  ------- DONE
  - Contract Balance display also for Factory Contract, and State, on DHCard  ----- DONE
  - way to click out of pop up, to go back  ------ DONE
  - Get events working right and neatly   -------- DONE
  - display more recent DH first  ------- DONE

  - display judges and participants via store-reducer-loop ------- DONE
  - show projects submitted by whom  ------- DONE
  - show if project/participant has a vote & can therefore call withdrawPrize ------ DONE
  


To Publish:
  - UML of process, stages, actors and functions    -------- DONE
  - Instruction page with UML and caveats, exceptions, requires, and diagrams
  - Properly document own github repo according to requirements   -- DO

  - Host project
  - Youtube videos about usage
  - Medium Post
  - Post on reddit, product hunt, etc, devpost
  - email companies about engagement / job opps
  - Ubuntu compatibility to replicate
  

To Share with Amal:
  - proper config of web3 when adding new contract
  - ability to get returned values both via events in middleware or via transaction receipt in State
  - instant handling of metamask EOA update
  - Pop-up components for gathering user input
