import { EventActions } from 'drizzle'
import { toast } from 'react-toastify'
import logger from './logger'

const contractEventNotifier = store => next => action => {
  if (action.type === EventActions.EVENT_FIRED) {
    const contract = action.name
    const contractEvent = action.event.event
    const message = action.event.returnValues
    const display = `${contract}(${contractEvent}): ${JSON.stringify(message)}`
    console.log("EVENT REDUCER: " + display)

    toast.success(display, { position: toast.POSITION.TOP_RIGHT })
  }
  return next(action)
}

const appMiddlewares = [contractEventNotifier]

export default appMiddlewares;


 // var contractConfig = {
  //   contractName: "0x066408929e8d5Ed161e9cAA1876b60e1fBB5DB75",
  //   web3Contract: new web3.eth.Contract(/* ... */)
  // }
  // 
  
  // // Using an action
  // dispatch({type: 'ADD_CONTRACT', drizzle, contractConfig, events, web3})
  
  // // Or using the Drizzle context object
  // this.context.drizzle.addContract(contractConfig, events)