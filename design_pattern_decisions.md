  - Factory - child
    - Operational circuit breaker
    - withdrawal pattern

  - using SafeMath for uint256 from OpenZeppelin
  - using Roles from OpenZepplin
  - state patterns isClosed modifiers



![diagram](./UML/UML_data_modeling.png)

# Design Pattern Decisions
---

## DHackathon Factory

A modular, factory-child design pattern was utilized where anyone can call the `createDHackathon` function of the `DHackathonFactory` contract to instantiate and become the _admin_ of a newly minted `DHackathon` contract. This design decision limits the responsibilities of the `DHackathonFactory` contract to only 3 functions (`createDHackathon`, `shutdown`, `withdrawFunds`) and two types of users, the _owner_ and everyone else. This contract inherist the `Ownable.sol` contract from OpenZeppelin for 2 reasons: to leverage the `onlyOwner` modifier and make the `shutdown` \& `withdrawFunds` functions only accessible to the _owner_ and to allow the owner to `transferOwnership` and `renounceOwnership`.

#### `createDHackathon` function

This function was designed to be called by anyone (including the _owner_). Given that we believe the functionality of the `DHackathon` contract — to seamleslly conduct a Hackathon in a decentralized manner is valuable — it has a cost of 0.1 ETH. This function instantiates a new `DHackathon` contract assigning _Admin_ priviledges to the caller, and keeps a record of the newly minted contract via mapping-struct combination for accountability purposes.

#### Circuit Breaker — `shutdown` function

The `shutdown` function is a circuit breaker that blocks the `createDHackathon` function. It was created in case any bugs are found within the `DHackathon` contract which is the one that hosts most of the functionality of this platform. The `withdrawFunds` funds was not blocked as it is restricted to the _owner_ via a modifier.
```
/// state variable
bool public operational = true;
/// modifier
modifier isOperational() {
    require(operational == true, "This contract has been stopped by the owner.");
    _;
}
/// function
function shutdown()
        public
        onlyOwner()
    {
        operational = !operational;
    }
```

The `operational` state variable was kept public as it is rendered in the UI to discourage everyone from calling `createDHackathon` when it is blocked.

#### `withdrawFunds` function

This function is restricted to the _owner_ and it sends the contract's balance, accumulated from DHackathon creations, to the _owner_. Note this function is an example of the withdrawal pattern being preferred over the push send pattern.

---

## DHackathon

The DHackathon contracts are minted by the `DHackathonFactory` contract. This design pattern makes each `DHackathon` contract modular and independent. Once instantiated, it has no concern or need for the `DHackathonFactory` that created it.

1. To stop selling tickets while the setting Lucky7Numbers phase is happening:

This modifier is in the Lucky7Store contract and is related to the sellRandomTicket, generateRandomTicket, and sellGeneratedTicket functions.

2. To stop the possible generation of Lucky7Numbers while a game is in curse:
```
modifier gameNotInCourse(){
        require(settingLucky7Numbers==true);
        _;
    }
```

3. To stop users to set new games until both time and pot setted are reached:
```
modifier prizesDeliveryEnabled() {
    bool potReached;
    bool timeReached;
    (, potReached, timeReached) = validateDelivery();
    if(isLocalBlockchain == true){
      require((potReached == true && timeReached == true) || isOwner());
    }
    else{
      require(potReached == true && timeReached == true);
    }
    _;
  }
```

4. To stop users on generating new Lucky7Numbers if we are waiting for one:
```
  bool waitingForLucky7Number = false;
```


This modifier is in the Lucky7Raflle contract and is related to the generateLuckyNumber which generates the Lucky7Numbers. The settingLucky7Numbers value is changed once the setNewGame of the Lucky7Raflle contract is called, i.e. when a new game is setted and is necessary to set the new Lucky7Numbers.

## Contract modularity and inheritances
The inheritances are as follow:
Lucky7Admin -> Lucky7TicketFactory -> Lucky7Raflle -> Lucky7Store

In the earlier stages of this project the contracts were pretty simple, but as the requirements were appearing, the code was getting more and more complex.
That's why i decided to divide the business logic in 4 modules:

1. Service Administration: Lucky7Admin

This contract contains the functions to change the selling and generating tickets prices, the oraclize gas limit and gas price and the wallet where the 30%
of the balance of the contract os going when a new game is setted.

2. Random numbers generation: Lucky7TicketFactory

This contract contains all the functions that generate random numbers, i.e. generates parameters, Tickets and Lucky7Numbers. This is the very essence of the game, the random numbers generated

3. Taking decisions to make the game work: Lucky7Raflle

This contract containts the function to know how and when to generate the Lucky7Numbers, when to Store the Lucky7Tickets in the lucky7TicketsArray of the Lucky7TicketFactory contract, how to order the Lucky7Numbers and Lucky7Tickets in ascending order, how to deliver the prizes, what parameters increment and what arrays to clean when a the setNewGame function is called.

4. The market: Lucky7Store

This contract contains the functions necessary to determine when to sell and generate tickets and when to stop to do it.


## [Withdrawal from contracts](https://solidity.readthedocs.io/en/v0.4.24/common-patterns.html#withdrawal-from-contracts) and not sending ETH to 0
When the setNewGame function of the Lucky7Raflle is called, it then calls the deliverPrizes function, which deliver the prizes for the best Lucky7Tickets. It proceed to check that the owner of those Lucky7Tickets is not an address 0, and then store the prizes on the pendingWithdrawals mapping. This way we avoid a DoS with (Unexpected) revert attack; the winners have to claim for them prizes instead of being automatically delivered.

## Feature Contracts
Ownable: OpenZeppelin contract. There's a lot of functions which are necesarily stricted to the admins. It's used for the onlyOwner modifier.


## Pseudo-Random Number Generator
Not presented yet, but is kind of a "numeric hash". While is true that Provable have a perfectly functional entropy source that could do the work, users needs a way to certificate that the game is not biased. That's why using this PRNG is important; since it acts as a "numeric hash", is unlikely to know the inputs that are going to produce certain output. It also works as a "watermark"; users can verify themselves that the tickets obtained corresponds to the paramaters purchased. Today, the parameters are 4 digits number, which means a space of (10000-1000)^2=81.000.000 distinct combinations, therefore that amount of numbers. The calculus comes from the idea that when asked for a 4 digit number, Wolfram responds with a number with the most significant digit distinct than 0, or strictly greater than 999 to be exact. 

Changing the query to 5 digits numbers, would result in a (100000-10000)^2 = 8.100.000.000 distinct numbers. This, asking for 2 parameters. Ask for 3 parameters would result in astronomics numbers. Future possibilities to ensure entropu of the game.

That said, the PRNG takes the mu and i parameter to generate Tickets and Lucky7Numbers.


## Lucky7Ticket and Tickets storage
Lucky7Tickets and Tickets are stored permanently on the Blockchain to verify, in future games and if a user wants to, that all the prices where delivered correctly. There have to be a work of "transparency", where users can claim they are the winner of certain past prize, and can demonstrate it through the values of the stored LuckyTickets and Tickets.

## Oraclize gas limit and gas price

OraclizeCustomGasPrice and OraclizeGasLimit where calculated in such way that the tickets weren't so expensive and the oraclize querys were to slow. This process was done on Rinkeby testnet through remix.

## Pot reached not using contract balance

For crowd-wise logic, is necessary to reach certain pot to deliver prizes. As is known that there's no way to make an EOA or an address to reject ether transfers, then there was necessary to design another method. To do so, in Lucky7Admin there's a function called validateDeliver() which calculates the pot according to ticket prices and provable prices, getting the subtraction of both
and multiplying them as a way to get the current pot. This way, 'forced ether sending' is discouraged because it does not have any effect on game cycle.

