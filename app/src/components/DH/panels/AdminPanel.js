import React from 'react'
import { Heading, Box, Flex } from 'rimble-ui'
import TextButton from '../..//misc/TextButton'
import Popup from '../../misc/Popup'

export default class AdminPanel extends React.Component {
  state= {
    activePopup: ""
  }

  togglePopup = (popupName) => {  
    this.setState({ activePopup: popupName })
  }

  render() {
    return (
      <Flex style={styles.container}>
        <Heading as={"h3"}>Admin Panel</Heading>
        <Box p={1} width={1} style={styles.boxH} >
          <TextButton text={"Submit Funds for Prize"} onClick={() => this.togglePopup("submitFunds")} size="small" style={{'margin':10, fontSize: 10}} />
          <TextButton text={"Open DHackathon"} onClick={this.props.openDHackathon} size="small" variant="danger" disabled={this.props.state === 0 ? false : true} style={{'margin':10, fontSize: 10}} />
          <TextButton text={"To Voting Stage"} onClick={this.props.toVotingDHackathon} size="small" variant="danger" disabled={this.props.state === 1 ? false : true} style={{'margin':10, fontSize: 10}} />
          <TextButton text={"Close DHackathon"} onClick={this.props.closeDHackathon} size="small" variant="danger" disabled={this.props.state === 2 ? false : true} style={{'margin':10, fontSize: 10}} />
          <TextButton text={"Add Judge"} onClick={() => this.togglePopup("addJudge")} size="small" variant="danger" disabled={this.props.state === 0 ? false : true} style={{'margin':10, fontSize: 10}} />
          <TextButton text={"Remove Judge"} onClick={() => this.togglePopup("removeJudge")} size="small" variant="danger" disabled={this.props.state != 3 ? false : true} style={{'margin':10, fontSize: 10}} />
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
        {this.state.activePopup === "submitFunds"
          ? <Popup
              text='Fund DHackathon Prize'
              submitFn={(inputs) => {this.props.submitFunds(inputs) && this.togglePopup("")} }
              inputsConfig={[ {displayName: 'Funds in ETH: ', name: "funding", type: "number", placeholder: "e.g. 3.00"} ]}
              removePopup={() => this.togglePopup("")}
            />
          : null
        }
        {this.state.activePopup === "addJudge" ?
          <Popup
            text='Add a new Judge'
            submitFn={(inputs) => {this.props.addJudge(inputs) && this.togglePopup("")} }
            inputsConfig={[ {displayName: 'Account: ', name: "account", type: "text", placeholder: "e.g. 0xAc03BB73b6a9e108530AFf4Df5077c2B3D481e5A"} ]}
            removePopup={() => this.togglePopup("")}
          />
          : null  
        }
        {this.state.activePopup === "removeJudge" ?
          <Popup
            text='Remove a current Judge'
            submitFn={(inputs) => {this.props.removeJudge(inputs) && this.togglePopup("")} }
            inputsConfig={[ {displayName: 'Account: ', name: "account", type: "text", placeholder: "e.g. 0xAc03BB73b6a9e108530AFf4Df5077c2B3D481e5A"} ]}
            removePopup={() => this.togglePopup("")}
          />
          : null
        }
      </Flex>
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