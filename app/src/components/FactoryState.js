import React from 'react'
import TextButton from './TextButton'
import { Flex, Box, Heading } from 'rimble-ui'
import { BN } from 'bn.js'

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
    this.owner = "" //"0x07A8646fdEc5BFa397Bb1c1879217Fca734F41Fb";
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
    console.log(new BN('2'));
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
    let tx = DHFContract.methods["shutdown"].cacheSend({from: this.activeAccount, gasLimit:22000})
  }

  // shutdownContract = () => {
  //   const DHFContract = this.props.drizzle.contracts.DHackathonFactory;
  //   DHFContract.methods["withdrawFunds"].cacheSend({from: this.activeAccount})
  // }

  createDHackathon = () => {
    const DHFContract = this.props.drizzle.contracts.DHackathonFactory;
    let tx = DHFContract.methods["createDHackathon"].cacheSend("test", "3")
  }


  render() {
    const DHFState = this.props.drizzleState.contracts.DHackathonFactory;
    console.log("DHFState: ", DHFState)
    const operational = DHFState.operational[this.state.operationalKey]
    const counter = DHFState.counter[this.state.counterKey]
    console.log(this.activeAccount)

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
        { this.state.isOwner ? (
          <Box p={1} width={1/3} >
            <TextButton text={"Pause Factory"} onClick={this.shutdownContract} disabled={!this.state.isOwner} size='small' variant='danger' style={{'fontSize': 10, 'height': '2rem', 'margin':5}} />
            {/* <TextButton text={"Withdraw Funds"} onClick={this.shutdownContract} disabled={!this.state.isOwner} size='small' variant='danger' style={{'fontSize': 10, 'height': '2rem'}} />  */}
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

// buttons: {
//   fontSize: 16,
//   borderRadius: 4,
//   borderWidth: 0.5,
//   borderColor: color.red,
//   padding: 5,
//   margin:20,
// },