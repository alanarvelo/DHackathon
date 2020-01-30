export const SET_ACTIVE_EOA = 'SET_ACTIVE_EOA'

// TO-DO: change for a dynamic assessment of Factory Owner

export function setActiveEOA (account) {
  return {
    type: SET_ACTIVE_EOA,
    account,
  }
}