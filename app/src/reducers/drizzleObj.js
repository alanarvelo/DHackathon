import { EventActions } from 'drizzle'
import { ADD_DRIZZLE_OBJ } from '../actions/drizzleObj'

export default function DrizzleObj (state={}, action) {
  if (action.type === ADD_DRIZZLE_OBJ ) {
    return {drizzle: action.drizzle}
  }
  else {
    return state
  }
}