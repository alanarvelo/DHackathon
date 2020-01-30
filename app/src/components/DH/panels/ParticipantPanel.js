import React from 'react'
import { Heading, Box, Flex } from 'rimble-ui'
import TextButton from '../..//misc/TextButton'
import Popup from '../../misc/Popup'

export default class ParticipantPanel extends React.Component {
  state= {
    activePopup: ""
  }

  togglePopup = (popupName) => {  
    this.setState({ activePopup: popupName })
  }

  render() {
    return (
      <Flex style={styles.container}>
        <Heading as={"h3"}>Participant Panel</Heading>
          <Box p={1} width={1} style={styles.boxH} >
            <Box width={1/3}> <TextButton text={"Deregister as Participant"} onClick={() => this.togglePopup("deregisterAsParticipant")} size="small" disabled={this.props.state!= 3 ? false : true} style={{'margin':10, fontSize: 10}} /> </Box>
            <Box width={1/3}> <TextButton text={"Submit Project's Github URL"} onClick={() => this.togglePopup("submitProject")} size="small" disabled={this.props.state=== 1 ? false : true} style={{'margin':10, fontSize: 10}} /> </Box>
            <Box width={1/3}> <TextButton text={"Withdraw Prize"} onClick={this.props.withdrawPrize} size="small" disabled={this.props.state=== 3 ? false : true} style={{'margin':10, fontSize: 10}} /> </Box>
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
        {this.state.activePopup === "deregisterAsParticipant" 
          ? <Popup
              text='Deregister active account from Participant role'
              submitFn={(inputs) => this.props.deregisterAsParticipant(inputs) && this.togglePopup("") }
              inputsConfig={[ {displayName: 'Account: ', name: "account", type: "text", placeholder: "e.g. 0xAc03BB73b6a9e108530AFf4Df5077c2B3D481e5A", initialValue: this.props.activeEOA} ]}
              removePopup={() => this.togglePopup("")}
            />
          : null
        }
        {this.state.activePopup === "submitProject"
          ? <Popup
              text="Submit project's github url"
              submitFn={ (inputs) => this.props.submitProject(inputs) && this.togglePopup("") }
              inputsConfig={[ {displayName: "Project's github url: ", name: "url", type: "url", placeholder: "e.g. https://github.com/alanarvelo/DHackathon/blob/master/app/src/middleware/index.js"} ]}
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