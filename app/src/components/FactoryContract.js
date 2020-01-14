import React from 'react'
import TextButton from './TextButton'
import { Flex, Box, Heading } from 'rimble-ui'
import { BN } from 'bn.js'
import Web3 from "web3";
import DHackathon from "../contracts/DHackathon.json";
import { addDrizzleObj } from "../actions/drizzleObj"


// TO-DO: create POP-UP for when transaction succeeds and fails

export default class FactoryContract extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      operationalKey: null,
      counterKey: null,
    }
  }

  componentDidMount() {
    const DHFContract = this.props.drizzle.contracts.DHackathonFactory;
    // get and save the keys to retrieve operational and counter from the store (drizzleState)
    let operationalKey = DHFContract.methods["operational"].cacheCall();
    let counterKey = DHFContract.methods["counter"].cacheCall();

    this.setState({ operationalKey, counterKey });
  }

  shutdownContract = () => {
    const DHFContract = this.props.drizzle.contracts.DHackathonFactory;
    let tx = DHFContract.methods["shutdown"].cacheSend({from: this.props.drizzleState.activeEOA.account})
  }

  withdrawFunds = () => {
    const DHFContract = this.props.drizzle.contracts.DHackathonFactory;
    let tx = DHFContract.methods["withdrawFunds"].cacheSend({from: this.props.drizzleState.activeEOA.account})
  }

  createDHackathon = async () => {
    if (this.props.drizzleState.drizzleStatus.initialized) {
      const DHFContract = this.props.drizzle.contracts.DHackathonFactory;
      let tx = DHFContract.methods["createDHackathon"].cacheSend("test", "3", {from: this.props.drizzleState.activeEOA.account, value: Web3.utils.toWei('.11', 'ether')})

      this.props.drizzle.store.dispatch(addDrizzleObj(this.props.drizzle))
    }
  }

  render() {
    const DHFState = this.props.drizzleState.contracts.DHackathonFactory;
    const operational = DHFState.operational[this.state.operationalKey]
    const counter = DHFState.counter[this.state.counterKey]
    let isOwner = this.props.drizzleState.activeEOA.isFactoryOwner

    return (
      <Flex style={styleCard}>
        <Heading>DHackathon Factory</Heading>
        <Box p={3} width={1/3} >
          <span>Is Operational:  </span>
          <strong>
            <br></br>
            { operational && JSON.stringify(operational.value) }
          </strong>
        </Box>
        <Box p={3} width={1/3} >
          <span>DHackathons Created:  </span>
          <strong>
            <br></br>
            { counter && counter.value }
          </strong>
        </Box>
        { isOwner ? (
          <Box p={1} width={1/3} >
            <TextButton text={ operational && operational.value ? "Pause Factory" : "Resume Factory"} onClick={this.shutdownContract} disabled={!isOwner} size='small' variant='danger' style={{'fontSize': 10, 'height': '2rem', 'margin':5}} />
            <TextButton text={"Withdraw Funds"} onClick={this.withdrawFunds} disabled={!isOwner} size='small' variant='danger' style={{'fontSize': 10, 'height': '2rem', 'margin':5}} /> 
          </Box> 
        ) : (
          <Box p={1} width={1/3} >
            <TextButton text={"Create DHackathon"} onClick={this.createDHackathon} style={{'margin':10}} /> 
          </Box>
        )}
      </Flex>
    )
  }
}

const styleCard = {
  backgroundColor: '#e6adbc',
  padding: 20,
  height: 120,
  borderWidth: 2,
  borderColor: 'red',
  borderRadius: 5,
}