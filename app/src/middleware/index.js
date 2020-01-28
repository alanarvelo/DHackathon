import { EventActions } from '@drizzle/store'
import { toast } from 'react-toastify'
import logger from './logger'
import DHackathon from "../contracts/DHackathon.json";
import Web3 from "web3";
import { ToastMessage } from 'rimble-ui'

const getCorrectWeb3 = () => {
  if (window.ethereum) {
    let web3 = new Web3(window.ethereum)
    return web3
  }
  else if (typeof window.web3 !== 'undefined') {
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    // Use Mist/MetaMask's provider.
    let web3 = new Web3(window.web3.currentProvider)
    return web3
  }
}

const contractEventNotifier = store => next => action => {
  //  to UI all succesfully emitted events
  // To-Do: handle each event separately and add returned values in the notification toast.
  if (action.type === EventActions.EVENT_FIRED) {
    console.log("THIS IS THE ACTION: ", action)
    const contract = action.name
    const currentContracts = store.getState()['contracts']
    console.log(currentContracts[contract].events.map(evt => evt.id), action.event.id)
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
      const { DHID, contractAddress } = action.event.returnValues;
      const contractName = `DH${DHID}`
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

// // Development purposes — creates a DHackathon contract at start, as to not have to hit createDHackathon every time.
// // One must also add a DHackathon contract to the 2_deploy_contract.js and put the contract address below
  // if (action.type === "DRIZZLE_INITIALIZED") {
  //   // let { _DHID, _contractAddress } = action.event.returnValues;
  //   let contractName = "DH0"
  //   let currentContracts = store.getState()['contracts']
  //   if (!Object.keys(currentContracts).includes(contractName)) {
  //     let web3 = getCorrectWeb3()
  //     let web3Contract = new web3.eth.Contract(DHackathon['abi'], "0x8647353CD6e92f5f06FC4083481b741fa354B77a")
  //     let contractConfig = { contractName, web3Contract}
  //     let events = ['FundingReceived', 'ProjectSubmitted', 'VoteSubmitted', 'PrizeWithdrawn',
  //                   'DHInPreparation', 'DHOpen', 'DHInVoting', 'DHClosed',
  //                   'JudgeAdded', 'JudgeRemoved', 'ParticipantAdded', 'ParticipantRemoved']
  //     console.log("CREATING TEST CONTRACT: ", contractConfig)
  //     store.dispatch({type: 'ADD_CONTRACT', contractConfig, events})
  //   }
  // }

  return next(action)
}


const appMiddlewares = [contractEventNotifier]

export default appMiddlewares;