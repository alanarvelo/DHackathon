import React from 'react'
import TextButton from './misc/TextButton'
import { Flex, Box, Heading } from 'rimble-ui'
import { BN } from 'bn.js'
import Web3 from "web3";
import DHackathon from "../contracts/DHackathon.json";
import Popup from './misc/Popup'

// TO-DO: create POP-UP for when transaction succeeds and fails

export default class FactoryContract extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      operationalKey: null,
      counterKey: null,
      showPopup: false, 
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

  createDHackathon = (name, prize) => {
    if (this.props.drizzleState.drizzleStatus.initialized) {
      const DHFContract = this.props.drizzle.contracts.DHackathonFactory;
      let tx = DHFContract.methods["createDHackathon"].cacheSend(name, prize, {from: this.props.drizzleState.activeEOA.account, value: Web3.utils.toWei('.11', 'ether')})
      this.togglePopup()
    }
  }

  togglePopup = () => {  
    this.setState({showPopup: !this.state.showPopup }) 
  }

  addNewContract = () => {
    let contractName = "New DHackathon"
    // let web3 = new Web3()
    let web3Contract = new this.props.drizzle.web3.eth.Contract(DHackathon['abi'], "0xcad8189e9ac902647a1833324109d87918174932") //second argument is new contract's address 
    console.log("THIS IS THE WEB3 Contract: ", web3Contract)
    let contractConfig = { contractName, web3Contract }
    let events = ['LogFundingReceived']
  
    // Using the Drizzle context object
    // this.props.drizzle.addContract(contractConfig, events)
    this.props.drizzle.store.dispatch({type: 'ADD_CONTRACT', contractConfig, events, web3:this.props.drizzle.web3})
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
            <TextButton text={"Create DHackathon"} onClick={this.togglePopup} style={{'margin':10}} /> 
          </Box>
        )}
        <div className="section">
          {/* <h1> Simple Popup Example In React Application </h1>  
          <button onClick={this.togglePopup}> Click To Launch Popup</button>   */}
          {this.state.showPopup ?
          <Popup  
            text='Create New DHackathon'  
            submitFn={this.createDHackathon}  
          />
          : null  
          }
        </div>
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