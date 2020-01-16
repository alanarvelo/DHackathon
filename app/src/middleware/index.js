import { EventActions } from '@drizzle/store'
import { toast } from 'react-toastify'
import logger from './logger'
import DHackathon from "../contracts/DHackathon.json";
import Web3 from "web3";


const contractEventNotifier = store => next => action => {
  if (action.type === EventActions.EVENT_FIRED) {
    // console.log("THIS IS THE ACTION: ", action)
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
        let web3 = new Web3("HTTP://127.0.0.1:9545")
        let web3Contract = new web3.eth.Contract(DHackathon['abi'], _contractAddress)
        let contractConfig = { contractName, web3Contract}
        let events = ['LogFundingReceived', 'LogProjectSubmitted', 'LogVoteSubmitted', 'LogPrizeWithdrawn',
                      'LogDHInPreparation', 'LogDHOpen', 'LogDHInVoting', 'LogDHClosed']
        
        store.dispatch({type: 'ADD_CONTRACT', contractConfig, events})
        // store.dispatch({type: 'DELETE_CONTRACT', contractName: "SimpleStorage"})
      }
    }

  }
  return next(action)
}

const appMiddlewares = [contractEventNotifier]

export default appMiddlewares;