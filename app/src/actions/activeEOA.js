export const SET_ACTIVE_EOA = 'SET_ACTIVE_EOA'

// TO-DO: change for a dynamic assessment of Factory Owner

export function setActiveEOA (account) {
  return {
    type: SET_ACTIVE_EOA,
    account,
    isFactoryOwner: account.toLowerCase() === "0x07A8646fdEc5BFa397Bb1c1879217Fca734F41Fb".toLowerCase(),
  }
}