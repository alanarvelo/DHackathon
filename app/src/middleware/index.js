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
  // console.log("THIS IS THE ACTION: ", action)
  if (action.type === EventActions.EVENT_FIRED) {
    console.log("THIS IS THE ACTION: ", action)
    const contract = action.name
    let currentContracts = store.getState()['contracts']
    console.log(currentContracts[contract].events.map(evt => evt.id))
    window.toastProvider.addMessage(`🚀 Event: ${action.event.event}`, {
      secondaryMessage: JSON.stringify(action.event.returnValues),
      variant: "success",
      colorTheme: "light",
      my: 1,
      closeElem: true,

      // actionHref: "https://etherscan.io/tx/0xcbc921418c360b03b96585ae16f906cbd48c8d6c2cc7b82c6db430390a9fcfed",
      // actionText: "Check",
    })

    if (action.event.event === "DHackathonCreated") {
      let { _DHID, _contractAddress } = action.event.returnValues;
      let contractName = `DH${_DHID}`
      
      console.log("STATE ON MIDDLEWARE: ", currentContracts.web3)
      if (!Object.keys(currentContracts).includes(contractName)) {
        let web3 = getCorrectWeb3()
        let web3Contract = new web3.eth.Contract(DHackathon['abi'], _contractAddress)
        let contractConfig = { contractName, web3Contract}
        let events = ['LogFundingReceived', 'LogProjectSubmitted', 'LogVoteSubmitted', 'LogPrizeWithdrawn',
                      'LogDHInPreparation', 'LogDHOpen', 'LogDHInVoting', 'LogDHClosed',
                      'JudgeAdded', 'JudgeRemoved', 'ParticipantAdded', 'ParticipantRemoved']
        
        store.dispatch({type: 'ADD_CONTRACT', contractConfig, events})
        // store.dispatch({type: 'DELETE_CONTRACT', contractName: "SimpleStorage"})
      }
    }

  }

  if (action.type === "DRIZZLE_INITIALIZED") {
    // let { _DHID, _contractAddress } = action.event.returnValues;
    let contractName = "TESTDH"
    let currentContracts = store.getState()['contracts']
    if (!Object.keys(currentContracts).includes(contractName)) {
      const { ethereum } = window
      let web3 = getCorrectWeb3()
      let web3Contract = new web3.eth.Contract(DHackathon['abi'], "0xBa3C31f834FC7f4b282B250331C76F0Ab1e42866")
      let contractConfig = { contractName, web3Contract}
      let events = ['LogFundingReceived', 'LogProjectSubmitted', 'LogVoteSubmitted', 'LogPrizeWithdrawn',
                    'LogDHInPreparation', 'LogDHOpen', 'LogDHInVoting', 'LogDHClosed',
                    'JudgeAdded', 'JudgeRemoved', 'ParticipantAdded', 'ParticipantRemoved']
      console.log("CREATING TEST CONTRACT: ", contractConfig)
      store.dispatch({type: 'ADD_CONTRACT', contractConfig, events})
    }
  }

  return next(action)
}


const appMiddlewares = [contractEventNotifier]

export default appMiddlewares;