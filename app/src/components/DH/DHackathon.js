import React from 'react'
import { Flex, Box, Heading } from 'rimble-ui'
import Web3 from "web3"
import DHCard from './DHCard'

import JudgePanel from './panels/JudgePanel'
import NoRolePanel from './panels/NoRolePanel'
import ParticipantPanel from './panels/ParticipantPanel'
import AdminPanel from './panels/AdminPanel'

// TO-DO: clean and further modularize this componenet

export default class DHackathon extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      nameKey: null,
      stateKey: null,
      balanceKey: null,
      EOARole: null,
      // activePopup: "",
      participantToTx: {},
      judgeToTx: {}
    }

    // this.DHContract = this.props.DHContract;
    this.DHName = this.props.DHName
    this.DHRoles = ["Admin", "Judge", "Participant", "No role"]
    this.DHContract = this.props.drizzle.contracts[this.DHName]
  }

  async componentDidMount() {
    this.DHContract = this.props.drizzle.contracts[this.DHName]
    const DHContract = this.props.drizzle.contracts[this.DHName];
    let nameKey = DHContract.methods["name"].cacheCall();
    let stateKey = DHContract.methods["state"].cacheCall();
    let balanceKey = DHContract.methods["balance"].cacheCall();
    let judgesListKey = await DHContract.methods["getJudgesList"].cacheCall();
    let participantsListKey = await DHContract.methods["getParticipantsList"].cacheCall();

    this.setState({ nameKey, stateKey, balanceKey, judgesListKey, participantsListKey });

    this.getActiveEOARole(this.props.drizzleState.activeEOA.account)

    this.listenToActiveAccountUpdates()

    let stateNow = await this.DHContract.methods.state().call()
    if (stateNow > 0) {
      this.trackRolesInfo()
    }
    
  }

  // listens for updates on the MetaMask active account. Beware: this is a MetaMask beta feature
  listenToActiveAccountUpdates() {
    try {
      this.props.drizzle.web3.currentProvider.publicConfigStore.on('update', ({ selectedAddress }) => {
        if (selectedAddress) this.getActiveEOARole(selectedAddress)
        else this.setState({EOARole: null})
      });
    } catch (error) {
      console.error("Couldn track role change web3: ", error)
    }
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

  // togglePopup = (popupName) => {  
  //   this.setState(prevState => ({
  //     ...prevState,
  //     "activePopup": popupName
  //   }))
  // }

  trackRolesInfo() {
    let participantsList = this.getCleanedParticipantsList()
    let participantToTx = {}
    participantsList.map(participant => {
      let tx = this.DHContract.methods["projects"].cacheCall(participant.account)
      participantToTx[participant.account] = tx
      return null
    })
    let judgesList = this.getCleanedJudgesList()
    let judgeToTx = {}
    judgesList.map(judge => {
      let tx = this.DHContract.methods["judgeVoted"].cacheCall(judge.account)
      judgeToTx[judge.account] = tx
      return null
    })
    this.setState({ participantToTx, judgeToTx})
  }

  /** ******************************************************************* FUNCTIONS ***************************************************************** */
  submitFunds = ({ funding }) => {
    this.DHContract.methods["submitFunds"].cacheSend({from: this.props.drizzleState.activeEOA.account, value: Web3.utils.toWei(funding, 'ether')})
  }

  /** ******************************************************************* ADMIN Functions *************************************************************** */
  openDHackathon = () => {
    this.DHContract.methods["openDHackathon"].cacheSend({from: this.props.drizzleState.activeEOA.account})
    this.trackRolesInfo()
  }
  toVotingDHackathon = () => this.DHContract.methods["toVotingDHackathon"].cacheSend({from: this.props.drizzleState.activeEOA.account})
  closeDHackathon = () => this.DHContract.methods["closeDHackathon"].cacheSend({from: this.props.drizzleState.activeEOA.account})

  addJudge = ({ account }) => {
    this.DHContract.methods["addJudge"].cacheSend(account, {from: this.props.drizzleState.activeEOA.account})
  }

  removeJudge = ({ account }) => {
    this.DHContract.methods["removeJudge"].cacheSend(account, {from: this.props.drizzleState.activeEOA.account})
  }

  /** ******************************************************************* JUDGE Functions *************************************************************** */
  submitVote = ({ winner }) => {
    this.DHContract.methods["submitVote"].cacheSend(winner, {from: this.props.drizzleState.activeEOA.account})
  }

  /** **************************************************************** PARTICIPANT Functions ************************************************************ */
  registerAsParticipant = ({ account }) => {
    this.DHContract.methods["registerAsParticipant"].cacheSend({from: this.props.drizzleState.activeEOA.account})
  }

  deregisterAsParticipant = ({ account }) => {
    this.DHContract.methods["deregisterAsParticipant"].cacheSend({from: this.props.drizzleState.activeEOA.account})
  }

  submitProject = ({ url }) => {
    this.DHContract.methods["submitProject"].cacheSend(url, {from: this.props.drizzleState.activeEOA.account})
  }

  withdrawPrize = () => this.DHContract.methods["withdrawPrize"].cacheSend({from: this.props.drizzleState.activeEOA.account})

  getCleanedJudgesList = () => {
    const DHState = this.props.drizzleState.contracts[this.DHName]
    let judgesList = DHState.getJudgesList[this.state.judgesListKey]
    if (!judgesList || !judgesList.value) return []
    return judgesList.value.filter(acc => acc !== "0x0000000000000000000000000000000000000000").map(acc => ({"account": acc}))
  }

  getCleanedParticipantsList = () => {
    const DHState = this.props.drizzleState.contracts[this.DHName]
    let participantsList = DHState.getParticipantsList[this.state.participantsListKey]
    if (!participantsList || !participantsList.value) return []
    return participantsList.value.filter(acc => acc !== "0x0000000000000000000000000000000000000000").map(acc => ({"account": acc}))
  }

  getJudgesCompleteInfo = (judgesList) => {
    const DHState = this.props.drizzleState.contracts[this.DHName]
    let completeInfoArray = []
    judgesList.map((judge) => {
      let tx = this.state.judgeToTx[judge.account]
      if (DHState.judgeVoted[tx]) {
        const voted = DHState.judgeVoted[tx].value
        completeInfoArray.push( {"account": judge.account, voted} )
      } else completeInfoArray.push( {"account": judge.account} )
      return null
    })
    return completeInfoArray
  }

  getParticipantsCompleteInfo = (participantsList) => {
    const DHState = this.props.drizzleState.contracts[this.DHName]
    let completeInfoArray = []
    participantsList.map((participant) => {
      let tx = this.state.participantToTx[participant.account]
      if (DHState.projects[tx] && DHState.projects[tx].value) {
        let { url, votes, withdrewPrize } = DHState.projects[tx].value
        completeInfoArray.push( {"account": participant.account, url, votes, withdrewPrize} )
      } else completeInfoArray.push( {"account": participant.account} )
      return null
    })
    return completeInfoArray
  }
  

  render() {
    const DHState = this.props.drizzleState.contracts[this.DHName]
    const DHContract = this.props.drizzle.contracts[this.DHName]
    this.DHContract = DHContract

    let name = DHState.name[this.state.nameKey]
    let state = DHState.state[this.state.stateKey]
    state = state ? parseInt(state.value) : null

    let balance = DHState.balance[this.state.balanceKey]
    balance = balance ? parseInt(balance.value) : null

    let judgesList = this.getCleanedJudgesList()
    let participantsList = this.getCleanedParticipantsList()
    if (state > 0) {
      participantsList = this.getParticipantsCompleteInfo(participantsList)
      judgesList = this.getJudgesCompleteInfo(judgesList)
    }
    
    let { EOARole } = this.state

    return (
      <div className="section">
        <Flex style={styles.container}>
          <Heading mb={2} as={"h2"} >{`${name ? name.value : "-" }`}</Heading>
          <Heading  mb={2} as={"h6"} >{`Active account's role: ${EOARole != null ? this.DHRoles[EOARole] : "-"}`}</Heading>
          <DHCard DHContract={DHContract} DHState={DHState} />
        
          <Box p={1} width={1} style={styles.boxH} >
            <div>
            <Heading as={"h5"}>Judges</Heading>
            <Box p={1} width={1/2} style={styles.boxV} >
              {judgesList.map(judge => (
                  <Box p={1} key={judge.account} width={1/judgesList.length} style={{fontSize: 12, margin:8, display: "flex", flexDirection:"column", alignItems:"flex-start", justifyContent:"space-around", width: "100%"}}>
                    <span> <strong>Account: </strong> {`${judge.account ? judge.account : ""}`} </span>
                    <span> <strong>Has voted: </strong> {`${judge.voted ? "yes": "no"}`} </span>
                  </Box>
                ))}
            </Box>
            </div>
            
            <div>
            <Heading as={"h5"}>Participants</Heading>
            <Box p={1} width={1/2} style={styles.boxV} >
              
                {participantsList.map(participant => (
                  <Box p={1} key={participant.account} width={1/participantsList.length} style={styles.boxVL}>
                    <span> <strong>Account: </strong> {`${participant.account ? participant.account : ""}`} </span>
                    <span style={{"display": "flex", flexDirection:"column", alignItems:"flex-start"}}> <strong>Project's url: </strong> {`${participant.url ? participant.url : ""}`} </span>
                    <span> <strong>Votes received: </strong> {`${participant.votes ? participant.votes : ""}`}</span>
                  </Box>
                ))}
            </Box>
            </div>
          </Box>
        </Flex>

        {EOARole === 0
          ? <AdminPanel 
              state={state}
              submitFunds={this.submitFunds}
              openDHackathon={this.openDHackathon}
              toVotingDHackathon={this.toVotingDHackathon}
              closeDHackathon={this.closeDHackathon}
              addJudge={this.addJudge}
              removeJudge={this.removeJudge}
              balance={balance}
            />
          : null
        }
        {EOARole === 2
          ? <ParticipantPanel 
              state={state}
              deregisterAsParticipant={this.deregisterAsParticipant}
              submitProject={this.submitProject}
              withdrawPrize={this.withdrawPrize}
              activeEOA={this.props.drizzleState.activeEOA.account} 
            />
          : null
        }
        {EOARole === 1
          ? <JudgePanel
              state={state}
              submitVote={this.submitVote}
            />
          : null
        }
        {EOARole === 3 ?
          <NoRolePanel
            state={state}
            submitFunds={this.submitFunds}
            registerAsParticipant={this.registerAsParticipant}
            activeEOA={this.props.drizzleState.activeEOA.account}
            balance={balance}
          />
          : null
        }
      </div>
    )
  }

}

const styles = {
  container: {
    backgroundColor: '#b5daff',
    padding: 10,
    margin: 3,
    // // "position":"center",
    // "width":"90%",
    // "height":"90%",
    borderWidth: 20,
    borderColor: '#982e4b',
    borderRadius: 5,
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
    justifyContent: 'space-around',
    alignItems: "center",
    // marginBottom: "20px"
  },
  boxV: {
    display: "flex",
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: "100%",
  },
  boxVL: {
    fontSize: 12,
    display: "flex",
    flexDirection:"column",
    alignItems:"flex-start",
    justifyContent:"center",
    width: "100%",
    marginTop: "18",
  },
}