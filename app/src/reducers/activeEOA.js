import { SET_ACTIVE_EOA } from '../actions/activeEOA'

export default function activeEOA (state={}, action) {
  switch (action.type) {
    case SET_ACTIVE_EOA :
      return {
        "account": action.account,
      }
    default :
      return state
  }
}