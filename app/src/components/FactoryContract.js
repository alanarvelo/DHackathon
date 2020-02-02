import React from 'react'
import TextButton from './misc/TextButton'
import { Flex, Box, Heading } from 'rimble-ui'
import Web3 from "web3";
import Popup from './misc/Popup'
import DHackathon from "../abis/DHackathon.json"


export default class FactoryContract extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      operationalKey: null,
      counterKey: null,
      ownerKey: null,
      showPopup: false,
    }
    this.DHContractEvents = ['FundingReceived', 'ProjectSubmitted', 'VoteSubmitted', 'PrizeWithdrawn',
                              'DHInPreparation', 'DHOpen', 'DHInVoting', 'DHClosed',
                              'JudgeAdded', 'JudgeRemoved', 'ParticipantAdded', 'ParticipantRemoved']
  }

  async componentDidMount() {
    const DHFContract = this.props.drizzle.contracts.DHackathonFactory;
    // get and save the keys to retrieve operational and counter from the store (drizzleState)
    const operationalKey = DHFContract.methods["operational"].cacheCall();
    const counterKey = DHFContract.methods["counter"].cacheCall();
    const ownerKey = DHFContract.methods["owner"].cacheCall();
    this.setState({ operationalKey, counterKey, ownerKey });

    // add previously created DHackathon contract by getting their address from the Factory
    const children = await this.props.drizzle.contracts.DHackathonFactory.methods.getChildren().call();
    children.map((childAddress) => this.addChildren(childAddress))
    
  }

  async addChildren(childAddress) {
    let contractName = `DH${childAddress.toLowerCase().slice(-4)}`
    if (!Object.keys(this.props.drizzleState.contracts).includes(contractName)) {
      let web3Contract = new this.props.drizzle.web3.eth.Contract(DHackathon['abi'], childAddress)
      await this.props.drizzle.addContract({contractName, web3Contract}, this.DHContractEvents)
    }
  }

  shutdownContract = () => {
    const DHFContract = this.props.drizzle.contracts.DHackathonFactory;
    DHFContract.methods["shutdown"].cacheSend({from: this.props.drizzleState.activeEOA.account})
  }

  withdrawFunds = () => {
    const DHFContract = this.props.drizzle.contracts.DHackathonFactory;
    DHFContract.methods["withdrawFunds"].cacheSend({from: this.props.drizzleState.activeEOA.account})
  }

  createDHackathon = ({ DHName, prize }) => {
    // if (this.props.drizzleState.drizzleStatus.initialized) {
      const DHFContract = this.props.drizzle.contracts.DHackathonFactory;
      DHFContract.methods["createDHackathon"].cacheSend(DHName, Web3.utils.toWei(prize, 'ether'), 
                                          {from: this.props.drizzleState.activeEOA.account, value: Web3.utils.toWei('.1', 'ether')})
      this.togglePopup()
    // }
  }

  togglePopup = () => {  
    this.setState({showPopup: !this.state.showPopup }) 
  }

  render() {
    const DHFState = this.props.drizzleState.contracts.DHackathonFactory;
    const operational = DHFState.operational[this.state.operationalKey]
    const counter = DHFState.counter[this.state.counterKey]
    const owner = DHFState.owner[this.state.ownerKey]
    let isOwner = owner && owner.value && this.props.drizzleState.activeEOA.account ? this.props.drizzleState.activeEOA.account.toLowerCase() === owner.value.toLowerCase() : false

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
        <div>
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