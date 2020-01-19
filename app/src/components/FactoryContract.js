import React from 'react'
import TextButton from './misc/TextButton'
import { Flex, Box, Heading } from 'rimble-ui'
import Web3 from "web3";
import Popup from './misc/Popup'
import DHackathon from "../contracts/DHackathon.json";

// TO-DO: create POP-UP for when transaction succeeds and fails

export default class FactoryContract extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      operationalKey: null,
      counterKey: null,
      showPopup: false, 
      createDHackathonTx: null
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

  createDHackathon = ({ DHName, prize }) => {
    // if (this.props.drizzleState.drizzleStatus.initialized) {
      const DHFContract = this.props.drizzle.contracts.DHackathonFactory;
      // let { DHName, prize } = argsFromPopup
      DHFContract.methods["createDHackathon"].cacheSend(DHName, Web3.utils.toWei(prize, 'ether'), 
                                          {from: this.props.drizzleState.activeEOA.account, value: Web3.utils.toWei('.1', 'ether')})
      // this.addNewContract()
      // this.setState({ createDHackathonTx })
      this.togglePopup()
    // }
  }

  togglePopup = () => {  
    this.setState({showPopup: !this.state.showPopup }) 
  }

  // let { _DHID, _contractAddress } = action.event.returnValues;
    //   let contractName = `DH${_DHID}`
    //   let currentContracts = store.getState()['contracts']
    //   console.log("STATE ON MIDDLEWARE: ", currentContracts.web3)
    //   if (!Object.keys(currentContracts).includes(contractName)) {
    //     let web3 = getCorrectWeb3()
    //     let web3Contract = new web3.eth.Contract(DHackathon['abi'], _contractAddress)
    //     let contractConfig = { contractName, web3Contract}
    //     let events = ['LogFundingReceived', 'LogProjectSubmitted', 'LogVoteSubmitted', 'LogPrizeWithdrawn',
    //                   'LogDHInPreparation', 'LogDHOpen', 'LogDHInVoting', 'LogDHClosed']
        
    //     store.dispatch({type: 'ADD_CONTRACT', contractConfig, events})

  addNewContract = () => {
    let contractName = "New DHackathon"
    // let web3 = new Web3()
    let web3Contract = new this.props.drizzle.web3.eth.Contract(DHackathon['abi'], "0xaA8E7D69bB55FF538c207029ffCf70C2Fb3C68aE") //second argument is new contract's address 
    console.log("THIS IS THE WEB3 Contract: ", web3Contract)
    let contractConfig = { contractName, web3Contract }
    let events = ['LogFundingReceived']
  
    // Using the Drizzle context object
    // this.props.drizzle.addContract(contractConfig, events)
    this.props.drizzle.store.dispatch({type: 'ADD_CONTRACT', contractConfig, events}) // web3: this.props.drizzle.web3
  }

  render() {
    const DHFState = this.props.drizzleState.contracts.DHackathonFactory;
    const operational = DHFState.operational[this.state.operationalKey]
    const counter = DHFState.counter[this.state.counterKey]
    let isOwner = this.props.drizzleState.activeEOA.isFactoryOwner
    // console.log("STATE: ", this.props.drizzleState)
    // console.log(this.state)
    // if ( (this.state.createDHackathonTx != null) &&
    //      (Object.keys(this.props.drizzleState.transactions).includes([this.state.createDHackathonTx])) &&
    //      (this.props.drizzleState.transactions[this.state.createDHackathonTx].status === "success")
    //      ) {
    //   console.log("TX RECEIPT: ", this.state.createDHackathonTx, this.props.drizzleState.transactions[this.state.createDHackathonTx].receipt)
    // }

    return (
      <Flex style={styles.container}>
        <Box style={styles.box}   p={3} width={3/10} >
          <Heading as={"h2"}> DHackathon Factory </Heading>
        </Box>
        <Box style={styles.box}   p={3} width={2/10} >
          <span style={{fontSize: 12}} >Is Operational:  </span>
          <strong>
            { operational && JSON.stringify(operational.value) }
          </strong>
        </Box>
        <Box style={styles.box}   p={3} width={2/10} >
          <span style={{fontSize: 12}} >DHackathons Created:  </span>
          <strong style={{marginRight: 40}}>
            { counter && counter.value }
          </strong>
        </Box>
        { isOwner ? (
          <Box style={styles.box}   p={1} width={3/10} >
            <TextButton text={ operational && operational.value ? "Pause Factory" : "Resume Factory"} onClick={this.shutdownContract} disabled={!isOwner} size='small' variant='danger' style={{'fontSize': 10, 'height': '2rem', 'margin':5}} />
            <TextButton text={"Withdraw Funds"} onClick={this.withdrawFunds} disabled={!isOwner} size='small' variant='danger' style={{'fontSize': 10, 'height': '2rem', 'margin':5}} /> 
          </Box> 
        ) : (
          <Box style={styles.box}   p={1} width={3/10} >
            <TextButton text={"Create DHackathon"} onClick={this.togglePopup} /> 
            <span style={{fontSize: 12}} >Costs 0.1 ETH</span>
          </Box>
        )}
        <div className="section">
          {this.state.showPopup ?
          <Popup
            text='Create New DHackathon'
            submitFn={this.createDHackathon}
            inputsConfig={[ {displayName: 'Name: ', name: "DHName", type: "text", placeholder: "e.g. Security Contest"},
                            {displayName: 'Prize in ETH: ', name: "prize", type: "number", placeholder: "e.g. 3.00"} ]}
            removePopup={() => this.togglePopup()}
          />
          : null  
          }
        </div>
      </Flex>
    )
  }
}

const styles = {
  container: {
    backgroundColor: '#e6adbc',
    padding: 20,
    height: 120,
    borderWidth: 2,
    borderColor: 'red',
    borderRadius: 5,
    display: "flex",
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: 'space-between',
    color: 'black'
  },
  box: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: 'center'
  }
}