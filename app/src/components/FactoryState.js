import React from 'react'
import TextButton from './TextButton';
import { Flex, Box, Heading } from 'rimble-ui';
import { EventActions } from 'drizzle'

// Account 16
// 0xe27d5e15d40963ccf2e33a8ba6992b36d456231b
// Account 4
// 0x06f7CD2AcF96040cA1Dd1F94BADBe240642Dc216

// 0xFE3B557E8Fb62b89F4916B721be55cEb828dBd73

// Contract Address
// 0xf079F3aF32195EE290dB1B29e4F32E3A1aF43209 (old)
// 0xC5b6E883f285b6c57eFD83566116b21F0f3fa996

// TO-DO: create POP-UP for when transaction succeeds and fails

export default class FactoryState extends React.Component {
  constructor(props) {
    super(props)
    this.owner = "0xe27d5e15d40963ccf2e33a8ba6992b36d456231b";
    this.activeAccount = "";
    this.state = {
      operationalKey: null,
      counterKey: null,
      ownerKey: null,
      isOwner: null,
      DHFRKey: null
    }
  }

  componentDidMount() {
    const DHFContract = this.props.drizzle.contracts.DHackathonFactory;
    console.log("DHackathon Factory from drizzle: ", DHFContract)
    // get and save the keys to retrieve operational and counter from the store (drizzleState)
    let operationalKey = DHFContract.methods["operational"].cacheCall();
    let counterKey = DHFContract.methods["counter"].cacheCall();

    this.setState({ operationalKey, counterKey });

    this.trackActiveAccount(this.props.drizzleState.accounts[0]);
    console.log("initial account form drizzle: ", this.props.drizzleState.accounts[0]);
    this.listenToActiveAccountUpdates();
  }

  // checks if the active accounts belogs to the contract owner
  trackActiveAccount(account) {
    if (this.activeAccount.toLowerCase() != account.toLowerCase()) {
      this.activeAccount = account;
      this.setState({isOwner: this.activeAccount.toLowerCase() == this.owner.toLowerCase()});
    }
  }

  // listens for updates on the MetaMask active account
  // TO-DO: dispatch through the action-reducer-middleware pattern to update the drizzleState with the active account
  listenToActiveAccountUpdates() {
    this.props.drizzle.web3.currentProvider.publicConfigStore.on('update', ({ selectedAddress }) => {
      this.trackActiveAccount(selectedAddress);
    });
  }

  shutdownContract = () => {
    const DHFContract = this.props.drizzle.contracts.DHackathonFactory;
    // this.props.drizzle.contracts.DHackathonFactory.methods.emitAnEvent().send({from: "0xe27d5e15d40963ccf2e33a8ba6992b36d456231b"})
    let tx = DHFContract.methods["emitAnEvent"].cacheSend({from: this.activeAccount}) // {from:"0xFE3B557E8Fb62b89F4916B721be55cEb828dBd73"}
  }


  render() {
    const DHFState = this.props.drizzleState.contracts.DHackathonFactory;
    console.log("DHFState: ", DHFState)
    const operational = DHFState.operational[this.state.operationalKey]
    const counter = DHFState.counter[this.state.counterKey]

    return (
      <Flex>
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
        <Box p={3} width={1/3} >
          <TextButton text={"Pause Factory"} onClick={this.shutdownContract} disabled={!this.state.isOwner} /> 
        </Box>
      </Flex>
    )
  }
}