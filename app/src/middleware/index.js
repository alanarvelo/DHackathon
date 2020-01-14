import { EventActions } from 'drizzle'
import { toast } from 'react-toastify'
import logger from './logger'
import DHackathon from "../contracts/DHackathon.json";


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
      let state = store.getState()
      let drizzle = state['DrizzleObj']['drizzle']

      let web3Contract = new drizzle.web3.eth.Contract(DHackathon['abi'], _contractAddress)
      let contractConfig = { contractName, web3Contract}
      
      let events = ['LogFundingReceived']
      
      store.dispatch({type: 'ADD_CONTRACT', drizzle, contractConfig, events})
    }

  }
  return next(action)
}

const appMiddlewares = [contractEventNotifier]

export default appMiddlewares;