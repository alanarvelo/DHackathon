import { EventActions } from '@drizzle/store'
import { toast } from 'react-toastify'
import logger from './logger'
import DHackathon from "../contracts/DHackathon.json";
import Web3 from "web3";

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
    const contractEvent = action.event.event
    const message = action.event.returnValues
    const display = `${contract}(${contractEvent}): ${JSON.stringify(message)}`
    // console.log("EVENT REDUCER: " + display)

    toast.success(display, { position: toast.POSITION.TOP_RIGHT })

    if (action.event.event === "DHackathonCreated") {
      let { _DHID, _contractAddress } = action.event.returnValues;
      let contractName = `DH${_DHID}`
      let currentContracts = store.getState()['contracts']
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
      let web3Contract = new web3.eth.Contract(DHackathon['abi'], "0xe5810EE875acad0cBAaA001144eB9ddd11aBf8E9")
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