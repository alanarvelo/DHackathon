import React from 'react'
import TextButton from '../misc/TextButton'
import { Flex, Box, Heading } from 'rimble-ui'
import Web3 from "web3"
import { BN } from 'bn.js'
import DHCard from './DHCard'
import Popup from '../misc/Popup'
import { Redirect } from 'react-router-dom'

// TO-DO: modularize this component into several compoenents
// Due to time constraints will be left as is until revisit

export default class DHackathon extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      nameKey: null,
      stateKey: null,
      balanceKey: null,
      EOARole: null,
      activePopup: "",
      participantToTx: {},
      judgeToTx: {}
    }

    // this.DHContract = this.props.drizzle.contracts[this.DHName];
    this.DHName = this.props.match.params.DHID
    this.DHRoles = ["Admin", "Judge", "Participant", "No role"]
    this.DHContract = this.props.drizzle.contracts[this.DHName];
  }

  async componentDidMount() {
    const DHContract = this.props.drizzle.contracts[this.DHName];
    let nameKey = DHContract.methods["name"].cacheCall();
    let stateKey = DHContract.methods["state"].cacheCall();
    let balanceKey = DHContract.methods["balance"].cacheCall();
    let judgesListKey = await DHContract.methods["getJudgesList"].cacheCall();
    let participantsListKey = await DHContract.methods["getParticipantsList"].cacheCall();

    this.setState({ nameKey, stateKey, balanceKey, judgesListKey, participantsListKey });

    this.getActiveEOARole(this.props.drizzleState.accounts[0])

    this.listenToActiveAccountUpdates()

    let stateNow = await DHContract.methods.state().call()
    if (stateNow > 0) {
      this.trackRolesInfo()
    }
    
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
      "activePopup": popupName
    }))
  }

  trackRolesInfo() {
    let participantsList = this.getCleanedParticipantsList()
    let participantToTx = {}
    participantsList.map(participant => {
      let tx = this.DHContract.methods["projects"].cacheCall(participant.account)
      participantToTx[participant.account] = tx
    })
    let judgesList = this.getCleanedJudgesList()
    let judgeToTx = {}
    judgesList.map(judge => {
      let tx = this.DHContract.methods["judgeVoted"].cacheCall(judge.account)
      judgeToTx[judge.account] = tx
    })
    console.log(judgeToTx)
    this.setState({ participantToTx, judgeToTx})
  }


  // submitFunds, openDHackathon, toVotingDHackathon, closeDHackathon, addJudge, removeJudge
  // J: submitVote
  // P: registerAsParticipant, deregisterAsParticipant, submitProject, viewProject, withdrawPrize
  submitFunds = async ({ funding }) => {
    this.DHContract.methods["submitFunds"].cacheSend({from: this.props.drizzleState.activeEOA.account, value: Web3.utils.toWei(funding, 'ether')})
    this.togglePopup("")
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
    this.togglePopup("")
  }

  removeJudge = ({ account }) => {
    this.DHContract.methods["removeJudge"].cacheSend(account, {from: this.props.drizzleState.activeEOA.account})
    this.togglePopup("")
  }

  /** ******************************************************************* JUDGE Functions *************************************************************** */
  
  submitVote = ({ winner }) => {
    this.DHContract.methods["submitVote"].cacheSend(winner, {from: this.props.drizzleState.activeEOA.account})
    this.togglePopup("")
  }


  /** **************************************************************** PARTICIPANT Functions ************************************************************ */
  registerAsParticipant = ({ account }) => {
    this.DHContract.methods["registerAsParticipant"].cacheSend({from: this.props.drizzleState.activeEOA.account})
    this.togglePopup("")
  }

  deregisterAsParticipant = ({ account }) => {
    this.DHContract.methods["deregisterAsParticipant"].cacheSend({from: this.props.drizzleState.activeEOA.account})
    this.togglePopup("")
  }

  // submitProject, viewProject, withdrawPrize
  submitProject = ({ url }) => {
    this.DHContract.methods["submitProject"].cacheSend(url, {from: this.props.drizzleState.activeEOA.account})
    this.togglePopup("")
  }

  // viewProject = ({ url }) => {
  //   this.DHContract.methods["viewProject"].cacheSend(url, {from: this.props.drizzleState.activeEOA.account})
  //   this.togglePopup("viewProject")
  // }

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
      console.log("here with judge: ", judge.account)
      console.log("JUDGES TXs: ", this.state.judgeToTx)
      let tx = this.state.judgeToTx[judge.account]
      console.log("JUDGEVOTED: ", tx, DHState.judgeVoted[tx])
      if (DHState.judgeVoted[tx]) {
        const voted = DHState.judgeVoted[tx].value
        console.log("PROJECTS: ", voted)
        completeInfoArray.push( {"account": judge.account, voted} )
      } else completeInfoArray.push( {"account": judge.account} )
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
    })
    return completeInfoArray
  }
   

  render() {
    if (!Object.keys(this.props.drizzleState.contracts).includes(this.DHName)) {
      return <Redirect to='/404' />
    }

    const DHState = this.props.drizzleState.contracts[this.DHName]
    // console.log("drizzle: ", this.props.drizzle)
    // console.log("STATE: ", this.props.drizzleState)

    let name = DHState.name[this.state.nameKey]
    let state = DHState.state[this.state.stateKey]
    state = state ? parseInt(state.value) : null

    // let balance = DHState.balance[this.state.balanceKey]
    // balance = balance ? Web3.utils.fromWei(balance.value) : "-"

    let judgesList = this.getCleanedJudgesList()
    let participantsList = this.getCleanedParticipantsList()
    if (state > 0) {
      participantsList = this.getParticipantsCompleteInfo(participantsList)
      judgesList = this.getJudgesCompleteInfo(judgesList)
      console.log(judgesList)
    }
    

    let { EOARole } = this.state

    return (
      <div className="section">
        <Flex style={styles.container}>
          <Heading mb={2} as={"h2"} >{`${name ? name.value : "-" }`}</Heading>
          <Heading  mb={2} as={"h6"} >{`Active account's role: ${EOARole != null ? this.DHRoles[EOARole] : "-"}`}</Heading>
          <DHCard DHContract={this.DHContract} DHState={DHState} />
        
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
          ?(<Flex style={styles.container}>
              <Heading as={"h3"}>Admin Panel</Heading>
              <Box p={1} width={1} style={styles.boxH} >
                <TextButton text={"Submit Funds for Prize"} onClick={() => this.togglePopup("submitFunds")} size="small" style={{'margin':10, fontSize: 10}} />
                <TextButton text={"Open DHackathon"} onClick={this.openDHackathon} size="small" variant="danger" disabled={EOARole === 0 && state === 0 ? false : true} style={{'margin':10, fontSize: 10}} />
                <TextButton text={"To Voting Stage"} onClick={this.toVotingDHackathon} size="small" variant="danger" disabled={EOARole === 0 && state === 1 ? false : true} style={{'margin':10, fontSize: 10}} />
                <TextButton text={"Close DHackathon"} onClick={this.closeDHackathon} size="small" variant="danger" disabled={EOARole === 0 && state === 2 ? false : true} style={{'margin':10, fontSize: 10}} />
                <TextButton text={"Add Judge"} onClick={() => this.togglePopup("addJudge")} size="small" variant="danger" disabled={EOARole === 0 && state === 0 ? false : true} style={{'margin':10, fontSize: 10}} />
                <TextButton text={"Remove Judge"} onClick={() => this.togglePopup("removeJudge")} size="small" variant="danger" disabled={EOARole === 0 && state != 3 ? false : true} style={{'margin':10, fontSize: 10}} />
              </Box>
              <Box p={1} width={1} style={styles.boxH} >
                <Box p={1} width={1} style={styles.boxVText}>
                  <ul align="left">
                    <li>To <i>Open</i> stage, contract balance must be >= than prize</li>
                    <li>Can submit funds until <i>Closed</i> stage</li>
                  </ul>
                </Box>
                <Box p={1} width={1} style={styles.boxVText}>
                  <ul align="left">
                    <li>To <i>Open</i> stage, at least 1 judge and 2 participants</li>
                    <li>Stage changes by Admin only</li>
                    <li>Stage changes are irrevercible</li>
                  </ul>
                </Box>
                <Box p={1} width={1} style={styles.boxVText}>
                  <ul align="left">
                    <li>Judges can only be added on the <i>In Preparation</i> stage</li>
                    <li>Judges can be removed before the <i>Closed</i> stage</li>
                  </ul>
                </Box>
              </Box>
            </Flex>)
          : null
        }

        {EOARole === 2
          ?(<Flex style={styles.container}>
            <Heading as={"h3"}>Participant Panel</Heading>
              <Box p={1} width={1} style={styles.boxH} >
                <Box width={1/3}> <TextButton text={"Deregister as Participant"} onClick={() => this.togglePopup("deregisterAsParticipant")} size="small" disabled={EOARole === 2 && state != 3 ? false : true} style={{'margin':10, fontSize: 10}} /> </Box>
                <Box width={1/3}> <TextButton text={"Submit Project's Github URL"} onClick={() => this.togglePopup("submitProject")} size="small" disabled={EOARole === 2 && state === 1 ? false : true} style={{'margin':10, fontSize: 10}} /> </Box>
                <Box width={1/3}> <TextButton text={"Withdraw Prize"} onClick={this.withdrawPrize} size="small" disabled={EOARole === 2 && state === 3 ? false : true} style={{'margin':10, fontSize: 10}} /> </Box>
              </Box>
              <Box p={1} width={1} style={styles.boxH} >
                <Box p={1} width={1} style={styles.boxVText} >
                  <ul align="left" >
                    <li>Can deregister before <i>Closed</i> stage</li>
                  </ul>
                </Box>
                <Box p={1} width={1} style={styles.boxVText} >
                  <ul align="left" >
                    <li>Projects submission during <i>Open</i> stage only</li>
                    <li>Project's url can be updated by re-submitting</li>
                  </ul>
                </Box>
                <Box p={1} width={1} style={styles.boxVText} >
                  <ul align="left" >
                    <li>Prize withdrawl on <i>Closed</i> stage if votes received</li>
                  </ul>
                </Box>
              </Box>
          </Flex>)
          : null
        }

        
        {EOARole === 1
          ?(<Flex style={styles.container}>
            <Heading as={"h3"}>Judge Panel</Heading>
            <Box p={1} width={1} style={styles.boxH} >
              <TextButton text={"Vote for winner"} onClick={() => this.togglePopup("submitVote")} size="small" disabled={EOARole === 1 && state === 2 ? false : true} style={{'margin':10, fontSize: 10}} />
            </Box>
            <Box p={1} width={1} style={styles.boxVText} >
              <ul align="left">
                <li>Can only vote once</li>
                <li>Must vote during <i>In Voting</i> stage </li>
              </ul>
            </Box>
          </Flex>)
          : null
        }
        
        {EOARole === 3
          ?(<Flex style={styles.container}>
            <Heading as={"h4"}>No Role Panel</Heading>
            <Box p={1} width={1} style={styles.boxH} >
              <TextButton text={"Submit Funds for Prize"} onClick={() => this.togglePopup("submitFunds")} size="small" style={{'margin':10, fontSize: 10}} />
              <TextButton text={"Register as Participant"} onClick={() => this.togglePopup("registerAsParticipant")} size="small" disabled={EOARole === 3 && state === 0 ? false : true} style={{'margin':10, fontSize: 10}} />
            </Box>
            <Box p={1} width={1} style={styles.boxH} >
              <Box p={1} width={1} style={styles.boxVText} >
                <ul align="left">
                  <li>Can submit funds before <i>Closed</i> stage</li>
                </ul>
              </Box>
              <Box p={1} width={1} style={styles.boxVText} >
                <ul align="left">
                  <li>Can register on <i>Open</i> stage only</li>
                </ul>
              </Box>
            </Box>
          </Flex>)
          : null
        }

        {/* Popup Land */}
        <div className="section">
          {this.state.activePopup === "submitFunds" ?
            <Popup
              text='Fund DHackathon Prize'
              submitFn={this.submitFunds}
              inputsConfig={[ {displayName: 'Funds in ETH: ', name: "funding", type: "number", placeholder: "e.g. 3.00"} ]}
              removePopup={() => this.togglePopup("")}
            />
            : null  
          }
          {this.state.activePopup === "addJudge" ?
            <Popup
              text='Add a new Judge'
              submitFn={this.addJudge}
              inputsConfig={[ {displayName: 'Account: ', name: "account", type: "text", placeholder: "e.g. 0xAc03BB73b6a9e108530AFf4Df5077c2B3D481e5A"} ]}
              removePopup={() => this.togglePopup("")}
            />
            : null  
          }
          {this.state.activePopup === "removeJudge" ?
            <Popup
              text='Remove a current Judge'
              submitFn={this.removeJudge}
              inputsConfig={[ {displayName: 'Account: ', name: "account", type: "text", placeholder: "e.g. 0xAc03BB73b6a9e108530AFf4Df5077c2B3D481e5A"} ]}
              removePopup={() => this.togglePopup("")}
            />
            : null
          }
          {this.state.activePopup === "registerAsParticipant" ?
            <Popup
              text='Register active account as a Participant'
              submitFn={this.registerAsParticipant}
              inputsConfig={[ {displayName: 'Account: ', name: "account", type: "text", placeholder: "e.g. 0xAc03BB73b6a9e108530AFf4Df5077c2B3D481e5A", initialValue: this.props.drizzleState.activeEOA.account} ]}
              removePopup={() => this.togglePopup("")}
            />
            : null  
          }
          {this.state.activePopup === "deregisterAsParticipant" ?
            <Popup
              text='Deregister active account from Participant role'
              submitFn={this.deregisterAsParticipant}
              inputsConfig={[ {displayName: 'Account: ', name: "account", type: "text", placeholder: "e.g. 0xAc03BB73b6a9e108530AFf4Df5077c2B3D481e5A", initialValue: this.props.drizzleState.activeEOA.account} ]}
              removePopup={() => this.togglePopup("")}
            />
            : null  
          }
          {this.state.activePopup === "submitProject" ?
            <Popup
              text="Submit project's github url"
              submitFn={this.submitProject}
              inputsConfig={[ {displayName: "Project's github url: ", name: "url", type: "url", placeholder: "e.g. https://github.com/alanarvelo/DHackathon/blob/master/app/src/middleware/index.js"} ]}
              removePopup={() => this.togglePopup("")}
            />
            : null  
          } 
          {this.state.activePopup === "submitVote" ?
            <Popup
              text="Submit address of proposed winner"
              submitFn={this.submitVote}
              inputsConfig={[ {displayName: "Account: ", name: "winner", type: "text", placeholder: "e.g. 0xAc03BB73b6a9e108530AFf4Df5077c2B3D481e5A"} ]}
              removePopup={() => this.togglePopup("")}
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
    backgroundColor: '#b5daff',
    padding: 10,
    margin: 3,
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
  boxV2: {
    display: "flex",
    flexDirection: 'column',
    alignItems: 'center',
    width: "100%",
    justifyContent: 'flex-start',
    // padding: '20px',
    paddingBottom: '15px',
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
  boxVText: {
    fontSize: 11,
    display: "flex",
    flexDirection:"column",
    alignItems:"center",
    justifyContent:"flex-start",
    width: "100%",
    // marginTop: "18",
  }
}