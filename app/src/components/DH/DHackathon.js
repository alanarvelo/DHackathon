import React from 'react'
import TextButton from '../misc/TextButton'
import { Flex, Box, Heading, justifyContent } from 'rimble-ui'
import { BN } from 'bn.js'
import Web3 from "web3";
import { Link } from 'rimble-ui';
import { Button } from 'rimble-ui';
import DHCard from './DHCard'

// TO-DO: create POP-UP for when transaction succeeds and fails

export default class DHackathon extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      stateKey: null,
      isAdminKey: null
    }
    this.DHName = this.props.match.params.DHID
    this.DHstates = ["In Preparation", "Open", "In Voting", "Closed"]
  }

  componentDidMount() {
    const DHContract = this.props.drizzle.contracts[this.DHName];
    let stateKey = DHContract.methods["state"].cacheCall();
    console.log("address: ", this.props.drizzleState.activeEOA.account)
    
    this.setState({ stateKey });
  }

  // submitFunds, openDHackathon, toVotingDHackathon, closeDHackathon, addJudge, removeJudge, removeParticipant
  submitFunds = () => {
    const DHContract = this.props.drizzle.contracts[this.DHName];
    let tx = DHContract.methods["submitFunds"].cacheSend({from: this.props.drizzleState.activeEOA.account, 
                                                          value: Web3.utils.toWei('3', 'ether')})
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

  async getRole() {
    const DHContract = this.props.drizzle.contracts[this.DHName];
    if (this.props.drizzleState.activeEOA.account) {
      console.log("address: ", this.props.drizzleState.activeEOA.account)
      let isAdminKey = await DHContract.methods.isAdmin(this.props.drizzleState.activeEOA.account).call();
      console.log("adminKey - returned: ", isAdminKey)
    }
  }

  render() {
    // const { drizzle, drizzleState } = this.props
    const DHContract = this.props.drizzle.contracts[this.DHName]
    const DHState = this.props.drizzleState.contracts[this.DHName]

    const state = DHState.state[this.state.stateKey]
    // const isAdmin = DHState.isAdmin[this.state.isAdminKey]
    // console.log(DHContract, DHState)//, isAdmin)
    console.log("address in RENDER: ", this.props.drizzleState)
    this.getRole()

    return (
      <div>
        <Heading mb={2}>{`DHackathon ${this.DHName}`}</Heading>
        <Heading  mb={2} as={"h3"}>{`State: ${state ? this.DHstates[state.value] : "-"}`}</Heading>
        <Flex style={styles.container}>
          <DHCard DHContract={DHContract} DHState={DHState} />

          <Heading as={"h2"}>Admin Panel</Heading>
          <Box p={1} width={1} style={styles.box} >
            <TextButton text={"Submit Funds for Prize"} onClick={this.submitFunds} size="small" style={{'margin':10, fontSize: 10}} />
            <TextButton text={"Open DHackathon"} onClick={this.openDHackathon} size="small" variant="danger" style={{'margin':10, fontSize: 10}} />
            <TextButton text={"To Voting State"} onClick={this.toVotingDHackathon} size="small" variant="danger" style={{'margin':10, fontSize: 10}} />
            <TextButton text={"Close DHackathon"} onClick={this.closeDHackathon} size="small" variant="danger" style={{'margin':10, fontSize: 10}} />

          </Box>

          <Box p={1} width={1/4} style={styles.box} >
            <Heading as={"h2"}>Judge Panel</Heading>
          </Box>
          
          
          <Heading as={"h2"}>Participant Panel</Heading>


        </Flex>
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