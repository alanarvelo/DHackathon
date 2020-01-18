import React from 'react'
import TextButton from '../misc/TextButton'
import { Flex, Box, Heading } from 'rimble-ui'
import Web3 from "web3";
import DHCard from './DHCard'
import Popup from '../misc/Popup'
import { Redirect } from 'react-router-dom'

// TO-DO: create POP-UP for when transaction succeeds and fails

export default class DHackathon extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      stateKey: null,
      balanceKey: null,
      EOARole: null,
      popups : {
        submitFunds: false,
        addJudge: false,
        removeJudge: false,
        removeParticipant: false,
        registerAsParticipant: false,
        deregisterAsParticipant: false,
        submitProject: false,
        submitVote: false,
      }

    }

    // this.DHContract = this.props.drizzle.contracts[this.DHName];
    this.DHName = this.props.match.params.DHID
    this.DHstates = ["In Preparation", "Open", "In Voting", "Closed"]
    this.DHRoles = ["Admin", "Judge", "Participant", "N/A"]
    this.DHContract = this.props.drizzle.contracts[this.DHName];
  }

  componentDidMount() {
    // Do not execute if the url points to a non-existing DHackathon
    if (!Object.keys(this.props.drizzleState.contracts).includes(this.DHName)) {
      console.log("The DHackathon in this path does not exist")
      return null
    }
    const DHContract = this.props.drizzle.contracts[this.DHName];
    let stateKey = DHContract.methods["state"].cacheCall();
    let balanceKey = DHContract.methods["balance"].cacheCall();

    this.setState({ stateKey, balanceKey });

    this.getActiveEOARole(this.props.drizzleState.accounts[0])

    console.log("address in RENDER: ", this.props.drizzleState, this.props.drizzle)
    this.listenToActiveAccountUpdates()
    
  }

  // listens for updates on the MetaMask active account. Beware: this is a MetaMask beta feature
  listenToActiveAccountUpdates() {
    this.props.drizzle.web3.currentProvider.publicConfigStore.on('update', ({ selectedAddress }) => {
      this.getActiveEOARole(selectedAddress)
    });
  }

  async getActiveEOARole(activeEOA) {
    let isAdmin = await this.DHContract.methods.isAdmin(activeEOA).call();
    let isJudge = await this.DHContract.methods.isJudge(activeEOA).call();
    let isParticipant = await this.DHContract.methods.isParticipant(activeEOA).call();
    if (isAdmin) this.setState({EOARole: 0})
    else if (isJudge) this.setState({EOARole: 1})
    else if (isParticipant) this.setState({EOARole: 2})
    else this.setState({EOARole: 3})
  }

  togglePopup = (popupName) => {  
    this.setState(prevState => ({
      ...prevState,
      "popups": {
        ...prevState["popups"],
        [popupName]: !prevState["popups"][popupName] 
      }
    }))
  }


  // submitFunds, openDHackathon, toVotingDHackathon, closeDHackathon, addJudge, removeJudge, removeParticipant
  // J: submitVote
  // P: registerAsParticipant, deregisterAsParticipant, submitProject, viewProject, withdrawPrize
  submitFunds = async ({ funding }) => {
    this.DHContract.methods["submitFunds"].cacheSend({from: this.props.drizzleState.activeEOA.account, value: Web3.utils.toWei(funding, 'ether')})
    this.togglePopup("submitFunds")
  }

  /** ******************************************************************* ADMIN Functions *************************************************************** */
  openDHackathon = () => this.DHContract.methods["openDHackathon"].cacheSend({from: this.props.drizzleState.activeEOA.account})
  toVotingDHackathon = () => this.DHContract.methods["toVotingDHackathon"].cacheSend({from: this.props.drizzleState.activeEOA.account})
  closeDHackathon = () => this.DHContract.methods["closeDHackathon"].cacheSend({from: this.props.drizzleState.activeEOA.account})

  addJudge = ({ account }) => {
    this.DHContract.methods["addJudge"].cacheSend(account, {from: this.props.drizzleState.activeEOA.account})
    this.togglePopup("addJudge")
  }

  removeJudge = ({ account }) => {
    this.DHContract.methods["removeJudge"].cacheSend(account, {from: this.props.drizzleState.activeEOA.account})
    this.togglePopup("removeJudge")
  }

  removeParticipant = ({ account }) => {
    this.DHContract.methods["removeParticipant"].cacheSend(account, {from: this.props.drizzleState.activeEOA.account})
    this.togglePopup("removeParticipant")
  }

  /** ******************************************************************* JUDGE Functions *************************************************************** */
  
  submitVote = ({ winner }) => {
    this.DHContract.methods["submitVote"].cacheSend(winner, {from: this.props.drizzleState.activeEOA.account})
    this.togglePopup("submitVote")
  }


  /** **************************************************************** PARTICIPANT Functions ************************************************************ */
  registerAsParticipant = ({ account }) => {
    this.DHContract.methods["registerAsParticipant"].cacheSend({from: this.props.drizzleState.activeEOA.account})
    this.togglePopup("registerAsParticipant")
  }

  deregisterAsParticipant = ({ account }) => {
    this.DHContract.methods["deregisterAsParticipant"].cacheSend({from: this.props.drizzleState.activeEOA.account})
    this.togglePopup("deregisterAsParticipant")
  }

  // submitProject, viewProject, withdrawPrize
  submitProject = ({ url }) => {
    this.DHContract.methods["submitProject"].cacheSend(url, {from: this.props.drizzleState.activeEOA.account})
    this.togglePopup("submitProject")
  }

  // viewProject = ({ url }) => {
  //   this.DHContract.methods["viewProject"].cacheSend(url, {from: this.props.drizzleState.activeEOA.account})
  //   this.togglePopup("viewProject")
  // }

  withdrawPrize = () => this.DHContract.methods["withdrawPrize"].cacheSend({from: this.props.drizzleState.activeEOA.account})



  render() {
    if (!Object.keys(this.props.drizzleState.contracts).includes(this.DHName)) {
      return <Redirect to='/' />
    }

    const DHState = this.props.drizzleState.contracts[this.DHName]
    console.log("drizzle: ", this.props.drizzle)
    console.log("STATE: ", this.props.drizzleState)


    let state = DHState.state[this.state.stateKey]
    state = state ? parseInt(state.value) : null
    let balance = DHState.balance[this.state.balanceKey]
    balance = balance ? Web3.utils.fromWei(balance.value) : "-"
    let { EOARole } = this.state

    return (
      <div>
        <Heading mb={2}>{`DHackathon ${this.DHName}`}</Heading>
        <Heading  mb={2} as={"h4"}>{`Stage: ${state != null ? this.DHstates[state] : "-"}`}</Heading>
        <Heading  mb={2} as={"h4"}>{`Balance: ${balance ? balance : "-"} ETH`}</Heading>
        <Heading  mb={2} as={"h4"}>{`Active account's role: ${EOARole != null ? this.DHRoles[EOARole] : "-"}`}</Heading>

        <Flex style={styles.container}>
          <DHCard DHContract={this.DHContract} DHState={DHState} />

          <Box p={1} width={1} style={styles.boxH} >
            <TextButton text={"Submit Funds for Prize"} onClick={() => this.togglePopup("submitFunds")} size="small" style={{'margin':10, fontSize: 10}} />
          </Box>

          <Heading as={"h2"}>Admin Panel</Heading>
          <Box p={1} width={1} style={styles.boxV} >
            <span>DHackathon stage changes are irrevercible</span>
            <span>Only admin can change stages</span>
            <span>Contract balance must be equal or greater than Prize for DHackathon to open</span>
          </Box>

          <Box p={1} width={1} style={styles.boxH} >
            <TextButton text={"Open DHackathon"} onClick={this.openDHackathon} size="small" variant="danger" disabled={EOARole === 0 && state === 0 ? false : true} style={{'margin':10, fontSize: 10}} />
            <TextButton text={"To Voting Stage"} onClick={this.toVotingDHackathon} size="small" variant="danger" disabled={EOARole === 0 && state === 1 ? false : true} style={{'margin':10, fontSize: 10}} />
            <TextButton text={"Close DHackathon"} onClick={this.closeDHackathon} size="small" variant="danger" disabled={EOARole === 0 && state === 2 ? false : true} style={{'margin':10, fontSize: 10}} />
          </Box>

          <Box p={1} width={1} style={styles.boxV} >
            <span>Judges can only be added in the In Preparation Stage</span>
          </Box>
          <Box p={1} width={1} style={styles.boxH} >
            <TextButton text={"Add Judge"} onClick={() => this.togglePopup("addJudge")} size="small" variant="danger" disabled={EOARole === 0 && state === 0 ? false : true} style={{'margin':10, fontSize: 10}} />
            <TextButton text={"Remove Judge"} onClick={() => this.togglePopup("removeJudge")} size="small" variant="danger" disabled={EOARole === 0 ? false : true} style={{'margin':10, fontSize: 10}} />
            <TextButton text={"Remove Participant"} onClick={() => this.togglePopup("removeParticipant")} size="small" variant="danger" disabled={EOARole === 0 ? false : true} style={{'margin':10, fontSize: 10}} />
          </Box>

          <Heading as={"h2"}>Judge Panel</Heading>
          <Box p={1} width={1} style={styles.boxV} >
            <span>Judges can only vote once and must be during the In Voting stage.</span>
          </Box>

          <Box p={1} width={1/4} style={styles.boxH} >
            <TextButton text={"Vote for winner"} onClick={() => this.togglePopup("submitVote")} size="small" disabled={EOARole === 1 && state === 2 ? false : true} style={{'margin':10, fontSize: 10}} />
          </Box>
          
          
          
          <Heading as={"h2"}>Participant Panel</Heading>
          <Box p={1} width={1} style={styles.boxV} >
            <span>Projects can only be submitted in the Open State</span>
            <span>Participants can updated their project's url by re-submitting</span>
          </Box>
          <Box p={1} width={1} style={styles.boxH} >
            <TextButton text={"Register as Participant"} onClick={() => this.togglePopup("registerAsParticipant")} size="small" disabled={EOARole === 3 && state === 0 ? false : true} style={{'margin':10, fontSize: 10}} />
            <TextButton text={"Deregister as Participant"} onClick={() => this.togglePopup("deregisterAsParticipant")} size="small" disabled={EOARole === 2 ? false : true} style={{'margin':10, fontSize: 10}} />
            <TextButton text={"Submit Project's Github URL"} onClick={() => this.togglePopup("submitProject")} size="small" disabled={EOARole === 2 && state === 1 ? false : true} style={{'margin':10, fontSize: 10}} />
            <TextButton text={"Withdraw Prize"} onClick={this.withdrawPrize} size="small" variant="danger" disabled={EOARole === 2 && state === 3 ? false : true} style={{'margin':10, fontSize: 10}} />
          </Box>


        </Flex>
        {/* Popup Land */}
        <div className="section">
          {this.state.popups.submitFunds ?
            <Popup
              text='Fund DHackathon Prize'
              submitFn={this.submitFunds}
              inputsConfig={[ {displayName: 'Funds in ETH: ', name: "funding", type: "number", placeholder: "e.g. 3.00"} ]}
            />
            : null  
          }
          {this.state.popups.addJudge ?
            <Popup
              text='Add a new Judge'
              submitFn={this.addJudge}
              inputsConfig={[ {displayName: 'Account: ', name: "account", type: "text", placeholder: "e.g. 0xAc03BB73b6a9e108530AFf4Df5077c2B3D481e5A"} ]}
            />
            : null  
          }
          {this.state.popups.removeJudge ?
            <Popup
              text='Remove a current Judge'
              submitFn={this.removeJudge}
              inputsConfig={[ {displayName: 'Account: ', name: "account", type: "text", placeholder: "e.g. 0xAc03BB73b6a9e108530AFf4Df5077c2B3D481e5A"} ]}
            />
            : null  
          }
          {this.state.popups.removeParticipant ?
            <Popup
              text='Remove a current Participant'
              submitFn={this.removeParticipant}
              inputsConfig={[ {displayName: 'Account: ', name: "account", type: "text", placeholder: "e.g. 0xAc03BB73b6a9e108530AFf4Df5077c2B3D481e5A"} ]}
            />
            : null  
          }
          {this.state.popups.registerAsParticipant ?
            <Popup
              text='Register active account as a Participant'
              submitFn={this.registerAsParticipant}
              inputsConfig={[ {displayName: 'Account: ', name: "account", type: "text", placeholder: "e.g. 0xAc03BB73b6a9e108530AFf4Df5077c2B3D481e5A", initialValue: this.props.drizzleState.activeEOA.account} ]}
            />
            : null  
          }
          {this.state.popups.deregisterAsParticipant ?
            <Popup
              text='Deregister active account from Participant role'
              submitFn={this.deregisterAsParticipant}
              inputsConfig={[ {displayName: 'Account: ', name: "account", type: "text", placeholder: "e.g. 0xAc03BB73b6a9e108530AFf4Df5077c2B3D481e5A", initialValue: this.props.drizzleState.activeEOA.account} ]}
            />
            : null  
          }
          {this.state.popups.submitProject ?
            <Popup
              text="Submit project's github url"
              submitFn={this.submitProject}
              inputsConfig={[ {displayName: "Project's github url: ", name: "url", type: "url", placeholder: "e.g. https://github.com/alanarvelo/DHackathon/blob/master/app/src/middleware/index.js"} ]}
            />
            : null  
          } 
          {this.state.popups.submitVote ?
            <Popup
              text="Submit address of proposed winner"
              submitFn={this.submitVote}
              inputsConfig={[ {displayName: "Account: ", name: "winner", type: "text", placeholder: "e.g. 0xAc03BB73b6a9e108530AFf4Df5077c2B3D481e5A"} ]}
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
  boxH: {
    display: "flex",
    flexDirection: 'row',
  },
  boxV: {
    display: "flex",
    flexDirection: 'column',
    alignItems: 'flex-start',
  }
}