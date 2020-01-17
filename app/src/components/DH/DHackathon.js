import React from 'react'
import TextButton from '../misc/TextButton'
import { Flex, Box, Heading, justifyContent } from 'rimble-ui'
import { BN } from 'bn.js'
import Web3 from "web3";
import { Link } from 'rimble-ui';
import { Button } from 'rimble-ui';
import DHCard from './DHCard'
import Popup from '../misc/Popup'

// TO-DO: create POP-UP for when transaction succeeds and fails

export default class DHackathon extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      stateKey: null,
      EOARole: null,
      balance: null,
      submitFundsPopup: false
    }
    this.DHName = this.props.match.params.DHID
    this.DHstates = ["In Preparation", "Open", "In Voting", "Closed"]
    this.DHRoles = ["Admin", "Judge", "Participant", "N/A"]
  }

  componentDidMount() {
    const DHContract = this.props.drizzle.contracts[this.DHName];
    let stateKey = DHContract.methods["state"].cacheCall();
    console.log("address: ", this.props.drizzleState.activeEOA.account)
    this.setState({ stateKey });

    this.getActiveEOARole(this.props.drizzleState.accounts[0])
    this.getContractBalance()

    console.log("address in RENDER: ", this.props.drizzleState, this.props.drizzle)
    this.listenToActiveAccountUpdates()
  }

  // this.props.drizzle.store.dispatch(setActiveEOA(this.props.drizzleState.accounts[0]))
  // this.listenToActiveAccountUpdates();

  // listens for updates on the MetaMask active account. Beware: this is a MetaMask beta feature
  listenToActiveAccountUpdates() {
    this.props.drizzle.web3.currentProvider.publicConfigStore.on('update', ({ selectedAddress }) => {
      this.getActiveEOARole(selectedAddress)
    });
  }

  async getActiveEOARole(activeEOA) {
    const DHContract = this.props.drizzle.contracts[this.DHName];
    console.log("address: ", activeEOA)
    let isAdmin = await DHContract.methods.isAdmin(activeEOA).call();
    let isJudge = await DHContract.methods.isJudge(activeEOA).call();
    let isParticipant = await DHContract.methods.isParticipant(activeEOA).call();
    if (isAdmin) this.setState({EOARole: 0})
    else if (isJudge) this.setState({EOARole: 1})
    else if (isParticipant) this.setState({EOARole: 2})
    else this.setState({EOARole: 3})
  }

  async getContractBalance() {
    const DHContract = this.props.drizzle.contracts[this.DHName];
    let balance = Web3.utils.fromWei(await this.props.drizzle.web3.eth.getBalance(DHContract.address))
    // let prize = Web3.utils.fromWei(await DHContract.methods.prize().call())
    this.setState({balance})
    console.log("Balance: ", balance)
  }

  togglePopup = (popupName) => {  
    this.setState(prevState => ({
      ...prevState,
      [popupName]: !prevState[popupName] 
    }))
  }

  // submitFunds, openDHackathon, toVotingDHackathon, closeDHackathon, addJudge, removeJudge, removeParticipant
  submitFunds = async (argsFromPopup) => {
    const DHContract = this.props.drizzle.contracts[this.DHName];
    let { funding } = argsFromPopup
    console.log("funding: ", funding)
    DHContract.methods["submitFunds"].cacheSend({from: this.props.drizzleState.activeEOA.account, 
                                                          value: Web3.utils.toWei(funding, 'ether')})
    this.togglePopup("submitFundsPopup")
    // this.getContractBalance()
  }

  openDHackathon = () => {
    const DHContract = this.props.drizzle.contracts[this.DHName];
    let tx = DHContract.methods["openDHackathon"].cacheSend({from: this.props.drizzleState.activeEOA.account})
  }

  toVotingDHackathon = () => {
    const DHContract = this.props.drizzle.contracts[this.DHName];
    let tx = DHContract.methods["toVotingDHackathon"].cacheSend({from: this.props.drizzleState.activeEOA.account})
  }

  closeDHackathon = () => {
    const DHContract = this.props.drizzle.contracts[this.DHName];
    let tx = DHContract.methods["closeDHackathon"].cacheSend({from: this.props.drizzleState.activeEOA.account})
  }

  render() {
    // const { drizzle, drizzleState } = this.props
    const DHContract = this.props.drizzle.contracts[this.DHName]
    const DHState = this.props.drizzleState.contracts[this.DHName]

    let state = DHState.state[this.state.stateKey]
    state = state ? parseInt(state.value) : null
    const { EOARole, balance } = this.state
    // this.getContractBalance()
    console.log(EOARole, state)

    return (
      <div>
        <Heading mb={2}>{`DHackathon ${this.DHName}`}</Heading>
        <Heading  mb={2} as={"h4"}>{`State: ${state != null ? this.DHstates[state] : "-"}`}</Heading>
        <Heading  mb={2} as={"h4"}>{`Balance: ${balance ? balance : "-"} ETH`}</Heading>
        <Heading  mb={2} as={"h4"}>{`Active account's role: ${EOARole != null ? this.DHRoles[EOARole] : "-"}`}</Heading>

        <Flex style={styles.container}>
          <DHCard DHContract={DHContract} DHState={DHState} />

          <Box p={1} width={1} style={styles.box} >
            <TextButton text={"Submit Funds for Prize"} onClick={() => this.togglePopup("submitFundsPopup")} size="small" style={{'margin':10, fontSize: 10}} />
          </Box>

          <Heading as={"h2"}>Admin Panel</Heading>
          <span>Contract balance must be equal or greater than Prize for DHackathon to open</span>
          <span>DHackathon state changes are irrevercible</span>
          <Box p={1} width={1} style={styles.box} >
            <TextButton text={"Open DHackathon"} onClick={this.openDHackathon} size="small" variant="danger" disabled={EOARole === 0 && state === 0 ? false : true} style={{'margin':10, fontSize: 10}} />
            <TextButton text={"To Voting State"} onClick={this.toVotingDHackathon} size="small" variant="danger" disabled={EOARole === 0 && state === 1 ? false : true} style={{'margin':10, fontSize: 10}} />
            <TextButton text={"Close DHackathon"} onClick={this.closeDHackathon} size="small" variant="danger" disabled={EOARole === 0 && state === 2 ? false : true} style={{'margin':10, fontSize: 10}} />

          </Box>

          <Box p={1} width={1/4} style={styles.box} >
            <Heading as={"h2"}>Judge Panel</Heading>
          </Box>
          
          
          <Heading as={"h2"}>Participant Panel</Heading>


        </Flex>
        <div className="section">
          {this.state.submitFundsPopup ?
            <Popup
              text='Fund DHackathon Prize'
              submitFn={this.submitFunds}
              inputsConfig={[ {displayName: 'Funds in ETH: ', name: "funding", type: "number", placeholder: "e.g. 3.00"} ]}
            />
            : null  
          }
        </div>
      </div>
    )
  }
}

const styles = {
  container: {
    backgroundColor: '#add8e6',
    padding: 20,
    margin: 5,
    // // "position":"center",
    // "width":"90%",
    // "height":"90%",
    borderWidth: 20,
    borderColor: '#982e4b',
    borderRadius: 10,
    // alignItems: 'center',
    // justifyContent: 'space-between',
    color: 'black',
    display: "flex",
    flexDirection: 'column',
    alignItems: 'space-between',
    justifyContent: 'space-around',
  },
  box: {
    display: "flex",
    flexDirection: 'row',
  }

}