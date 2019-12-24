import { EventActions } from 'drizzle'
import { toast } from 'react-toastify'

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

