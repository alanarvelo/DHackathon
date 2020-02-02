import { EventActions } from '@drizzle/store'
import DHackathon from "../abis/DHackathon.json";
import Web3 from "web3";

// from drizzle's initializeWeb3 function
const getCorrectWeb3 = () => {
  if (window.ethereum) {
    let web3 = new Web3(window.ethereum)
    return web3
  }
  else if (typeof window.web3 !== 'undefined') {
    let web3 = new Web3(window.web3.currentProvider)
    return web3
  }
}

const contractEventNotifier = store => next => action => {
  //  to UI all succesfully emitted events
  // To-Do: handle each event separately and add returned values in the notification toast.
  if (action.type === EventActions.EVENT_FIRED) {
    const contract = action.name
    const currentContracts = store.getState()['contracts']
    if (!currentContracts[contract].events.map(evt => evt.id).includes(action.event.id)) {
      window.toastProvider.addMessage(`🚀 Event: ${action.event.event}`, {
        // secondaryMessage: JSON.stringify(action.event.returnValues),
        variant: "success",
        colorTheme: "light",
        my: 1,
        closeElem: true,
        // actionHref: "https://etherscan.io/tx/0xcbc921418c360b03b96585ae16f906cbd48c8d6c2cc7b82c6db430390a9fcfed",
        // actionText: "Check",
      })
    }

    // Specific DHackathon Creation Event
    if (action.event.event === "DHackathonCreated") {
      const { contractAddress } = action.event.returnValues;
      const contractName = `DH${contractAddress.toLowerCase().slice(-4)}`
      if (!Object.keys(currentContracts).includes(contractName)) {
        let web3 = getCorrectWeb3()
        let web3Contract = new web3.eth.Contract(DHackathon['abi'], contractAddress)
        let contractConfig = { contractName, web3Contract}
        let events = ['FundingReceived', 'ProjectSubmitted', 'VoteSubmitted', 'PrizeWithdrawn',
                      'DHInPreparation', 'DHOpen', 'DHInVoting', 'DHClosed',
                      'JudgeAdded', 'JudgeRemoved', 'ParticipantAdded', 'ParticipantRemoved']
        
        store.dispatch({type: 'ADD_CONTRACT', contractConfig, events})
        // store.dispatch({type: 'DELETE_CONTRACT', contractName: "SimpleStorage"})
      }
    }

  }

  // // Development purposes — to do stuff once drizzles initializes
  // if (action.type === "DRIZZLE_INITIALIZED") {
  // }

  return next(action)
}

const appMiddlewares = [contractEventNotifier]

export default appMiddlewares;