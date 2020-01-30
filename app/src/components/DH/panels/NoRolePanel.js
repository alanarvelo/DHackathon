import React from 'react'
import { Heading, Box, Flex } from 'rimble-ui'
import TextButton from '../..//misc/TextButton'
import Popup from '../../misc/Popup'

export default class NoRolePanel extends React.Component {
  state= {
    activePopup: ""
  }

  togglePopup = (popupName) => {  
    this.setState({ activePopup: popupName })
  }

  render() {
    return (
      <Flex style={styles.container}>
        <Heading as={"h4"}>No Role Panel</Heading>
        <Box p={1} width={1} style={styles.boxH} >
          <TextButton text={"Submit Funds for Prize"} onClick={() => this.togglePopup("submitFunds")} size="small" style={{'margin':10, fontSize: 10}} />
          <TextButton text={"Register as Participant"} onClick={() => this.togglePopup("registerAsParticipant")} size="small" disabled={this.props.state === 0 ? false : true} style={{'margin':10, fontSize: 10}} />
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
        {this.state.activePopup === "submitFunds"
          ? <Popup
              text='Fund DHackathon Prize'
              submitFn={(inputs) => { this.props.submitFunds(inputs); this.togglePopup("") }}
              inputsConfig={[ {displayName: 'Funds in ETH: ', name: "funding", type: "number", placeholder: "e.g. 3.00"} ]}
              removePopup={() => this.togglePopup("")}
            />
          : null
        }
        {this.state.activePopup === "registerAsParticipant"
          ? <Popup
              text='Register active account as a Participant'
              submitFn={(inputs) => { this.props.registerAsParticipant(inputs); this.togglePopup("") }} 
              inputsConfig={[ {displayName: 'Account: ', name: "account", type: "text", placeholder: "e.g. 0xAc03BB73b6a9e108530AFf4Df5077c2B3D481e5A", initialValue: this.props.activeEOA} ]}
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